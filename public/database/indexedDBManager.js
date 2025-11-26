// src/utils/indexedDBManager.js
class IndexedDBManager {
  // 私有静态实例属性
  static instance = null;
  // 防止直接实例化的标记
  static isCreatingInstance = false;

  constructor(dbName = 'activityDB', dbVersion = 1) {
    // 防止通过new关键字直接实例化
    if (!IndexedDBManager.isCreatingInstance) {
      throw new Error('请使用IndexedDBManager.getInstance()方法获取实例');
    }

    this.dbName = dbName;
    this.dbVersion = dbVersion;
    this.db = null;
    this.storeNames = ['banners', 'categories', 'activities', 'announcements'];
    // 连接状态标志
    this.connected = false;
    // 初始化Promise，用于跟踪初始化状态
    this.initializationPromise = null;
  }

  // 获取单例实例的静态方法
  static getInstance() {
    if (!IndexedDBManager.instance) {
      // 设置标记允许创建实例
      IndexedDBManager.isCreatingInstance = true;
      // 创建实例
      IndexedDBManager.instance = new IndexedDBManager();
      // 重置标记，防止后续直接实例化
      IndexedDBManager.isCreatingInstance = false;
    }
    return IndexedDBManager.instance;
  }

  // 初始化数据库连接
  async init() {
    // 如果已有初始化进行中，返回同一个Promise避免重复初始化
    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    // 如果已经连接，直接返回
    if (this.connected && this.db) {
      return this.db;
    }

    // 创建新的初始化Promise
    this.initializationPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = (event) => {
        console.error('数据库打开失败:', event.target.error);
        this.connected = false;
        this.initializationPromise = null;
        reject(event.target.error);
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        this.connected = true;
        console.log('数据库连接成功');
        // 数据库连接关闭时重置状态
        this.db.onclose = () => {
          console.log('数据库连接已关闭');
          this.connected = false;
          this.db = null;
        };
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        this.db = event.target.result;

        // 创建各个存储对象
        this.storeNames.forEach((storeName) => {
          if (!this.db.objectStoreNames.contains(storeName)) {
            this.db.createObjectStore(storeName, { keyPath: 'id' });
            console.log(`创建存储对象: ${storeName}`);
          }
        });
      };
    });

    return this.initializationPromise;
  }

  // 获取事务和存储对象
  getTransaction(storeName, mode = 'readonly') {
    if (!this.db) {
      throw new Error('数据库未初始化');
    }
    const transaction = this.db.transaction(storeName, mode);
    const store = transaction.objectStore(storeName);
    return { transaction, store };
  }

  // 初始化数据
  async initializeData(initialData) {
    try {
      await this.init();

      for (const [storeName, data] of Object.entries(initialData)) {
        if (!this.storeNames.includes(storeName)) {
          console.warn(`存储对象 ${storeName} 不存在，跳过数据初始化`);
          continue;
        }

        const { transaction, store } = this.getTransaction(
          storeName,
          'readwrite'
        );

        // 检查是否已有数据，避免重复插入
        const countRequest = store.count();
        const count = await new Promise((resolve) => {
          countRequest.onsuccess = () => resolve(countRequest.result);
        });

        if (count === 0) {
          // 处理单条数据或数组数据
          if (Array.isArray(data)) {
            data.forEach((item) => {
              store.add(item);
            });
          } else {
            // 单条数据也添加到数据库
            store.add(data);
          }
          console.log(`${storeName} 数据初始化完成`);
        } else {
          console.log(`${storeName} 已有数据，跳过初始化`);
        }

        await new Promise((resolve, reject) => {
          transaction.oncomplete = resolve;
          transaction.onerror = reject;
        });
      }
    } catch (error) {
      console.error('数据初始化失败:', error);
      throw error;
    }
  }

  // 获取所有数据
  async getAll(storeName) {
    try {
      await this.init();
      const { store } = this.getTransaction(storeName);

      return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error(`获取${storeName}数据失败:`, error);
      throw error;
    }
  }

  // 根据条件查询数据 @TODO 有待打磨
  async query(storeName, query) {
    try {
      await this.init();
      const { store } = this.getTransaction(storeName);

      return new Promise((resolve, reject) => {
        let request = store.getAll();
        // 这里直接取出所有然后根据键和值进行简单过滤
        request.onsuccess = () => {
          // 如果query为空，返回所有数据
          if (!query || Object.keys(query).length === 0) {
            resolve(request.result);
            return;
          }
          // 所有满足的数据
          const allData = request.result.filter((item) => {
            return Object.keys(query).every((key) => {
              // 避开分页相关参数
              if (['page', 'pageSize'].includes(key)) {
                return true;
              }
              // 处理状态
              if (key === 'status' && query[key]) {
                return query[key].includes(item[key]);
              }
              // 处理特殊的时间类型，判断是否在范围内
              if (key === 'startTime') {
                return new Date(item['startTime']) >= new Date(query[key]);
              }
              if (key === 'endTime') {
                return new Date(item['endTime']) <= new Date(query[key]);
              }
              // 处理关键字模糊搜索
              if (key === 'title' && query[key]) {
                return item[key]
                  .toLowerCase()
                  .includes(query[key].toLowerCase());
              }
              if (key === 'description' && query[key]) {
                return item[key]
                  .toLowerCase()
                  .includes(query[key].toLowerCase());
              }
              if (key === 'rules' && query[key]) {
                return item[key]
                  .toLowerCase()
                  .includes(query[key].toLowerCase());
              }
              // 普通键值对匹配
              return item[key] === query[key];
            });
          });
          // 分页逻辑数据，根据传过来的pageSize和page进行分页
          const pageData = allData.slice(
            (query.page - 1) * query.pageSize,
            query.page * query.pageSize
          );
          resolve({ data: pageData, total: allData.length });
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error(`查询${storeName}数据失败:`, error);
      throw error;
    }
  }

  // 添加数据
  async add(storeName, data) {
    try {
      await this.init();
      const { store } = this.getTransaction(storeName, 'readwrite');

      const request = store.add(data);

      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          console.log(`添加${storeName}数据成功`);
          resolve({ id: request.result, ...data });
        };
        request.onerror = () => {
          console.error(`添加${storeName}数据失败:`, request.error);
          reject(request.error);
        };
      });
    } catch (error) {
      console.error(`添加${storeName}数据失败:`, error);
      throw error;
    }
  }

  // 更新数据
  async update(storeName, data) {
    try {
      await this.init();
      const { store } = this.getTransaction(storeName, 'readwrite');

      // 检查数据是否存在
      const existingData = await this.getById(storeName, data.id);
      if (!existingData) {
        throw new Error(`ID为${data.id}的数据不存在`);
      }

      const request = store.put(data);

      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          console.log(`更新${storeName}数据成功`);
          resolve(data);
        };
        request.onerror = () => {
          console.error(`更新${storeName}数据失败:`, request.error);
          reject(request.error);
        };
      });
    } catch (error) {
      console.error(`更新${storeName}数据失败:`, error);
      throw error;
    }
  }

  // 删除数据
  async delete(storeName, id) {
    try {
      await this.init();
      const { store } = this.getTransaction(storeName, 'readwrite');

      const request = store.delete(id);

      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          console.log(`删除${storeName}数据成功，ID:`, id);
          resolve({ success: true, id });
        };
        request.onerror = () => {
          console.error(`删除${storeName}数据失败:`, request.error);
          reject(request.error);
        };
      });
    } catch (error) {
      console.error(`删除${storeName}数据失败:`, error);
      throw error;
    }
  }

  // 清空存储对象
  async clear(storeName) {
    try {
      await this.init();
      const { store } = this.getTransaction(storeName, 'readwrite');

      const request = store.clear();

      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          console.log(`${storeName}数据已清空`);
          resolve({ success: true });
        };
        request.onerror = () => {
          console.error(`清空${storeName}数据失败:`, request.error);
          reject(request.error);
        };
      });
    } catch (error) {
      console.error(`清空${storeName}数据失败:`, error);
      throw error;
    }
  }

  // 获取连接状态
  isConnected() {
    return this.connected;
  }
}

// 使用单例模式获取实例
const dbManager = IndexedDBManager.getInstance();
export default dbManager;
