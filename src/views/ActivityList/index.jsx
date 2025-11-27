import { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Table, Tag, Avatar, Button } from '@douyinfe/semi-ui';
import { formatDateTime } from '@/utils/index.js';
import { queryActivityList } from '@/apis';
import ActivitySearchForm from './ActivitySearchForm';
import { statusConfig, unknownStatus } from '@/constants/index.js';

const ActivityList = () => {
  const [activityList, setActivityList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const { id: categoryId } = useParams();
  const navigate = useNavigate();
  // 表单配置
  const formConfig = {
    items: [
      {
        type: 'input',
        field: 'keyword',
        label: '关键词',
        style: { width: 250 },
        placeholder: '请输入活动名称或描述',
      },
      {
        type: 'multiSelect',
        field: 'status',
        label: '活动状态',
        style: { width: 300 },
        placeholder: '请选择状态',
        options: [
          { value: 'ongoing', label: '进行中' },
          { value: 'upcoming', label: '即将开始' },
          { value: 'ended', label: '已结束' },
        ],
      },
      {
        type: 'datePicker',
        field: 'dateRange',
        label: '时间范围',
        style: { width: 300 },
        props: { type: 'dateRange' },
      },
      {
        type: 'input',
        field: 'creator',
        label: '创建人',
        style: { width: 200 },
        placeholder: '请输入创建人',
      },
    ],
  };

  // 从URL参数中获取初始值
  const getInitialValues = () => {
    // 获取URL中的参数
    const status = searchParams.get('status');
    const page = searchParams.get('page');
    const pageSizeParam = searchParams.get('pageSize');
    const startTime = searchParams.get('startTime');
    const endTime = searchParams.get('endTime');
    const keyword = searchParams.get('keyword');
    const creator = searchParams.get('creator');

    return {
      status: status ? status.split(',') : ['ongoing'],
      startTime: startTime ? new Date(startTime) : null,
      endTime: endTime ? new Date(endTime) : null,
      keyword: keyword || undefined,
      creator: creator || undefined,
      page: page ? parseInt(page, 10) : 1,
      pageSize: pageSizeParam ? parseInt(pageSizeParam, 10) : 10,
    };
  };

  // 获取活动列表数据
  const fetchActivityList = useCallback(
    async (params = {}) => {
      setLoading(true);
      try {
        const activity = await queryActivityList({ categoryId, ...params });
        console.log('查询参数:', { categoryId, ...params });
        console.log('查询结果:', activity || []);
        setActivityList(activity?.data || []);
        setTotal(activity?.total || 0);
      } catch (error) {
        console.error('获取数据失败:', error);
        setActivityList([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    },
    [categoryId]
  );

  useEffect(() => {
    // 检查URL是否已经有参数
    const hasSearchParams = Array.from(searchParams.keys()).length > 0;

    // 如果URL没有参数，则设置默认参数
    if (!hasSearchParams) {
      setSearchParams({ status: 'ongoing', page: 1, pageSize: 10 });
      setCurrentPage(1);
      setPageSize(10);
      fetchActivityList({
        categoryId,
        status: 'ongoing',
        page: 1,
        pageSize: 10,
      });
    } else {
      // 如果URL已有参数，则使用这些参数进行查询
      const params = {};
      for (const [key, value] of searchParams.entries()) {
        if (value !== undefined && value !== null && value !== '') {
          params[key] = value;
        }
      }

      // 更新本地状态
      const page = searchParams.get('page');
      const pageSizeParam = searchParams.get('pageSize');

      if (page) setCurrentPage(parseInt(page, 10));
      if (pageSizeParam) setPageSize(parseInt(pageSizeParam, 10));

      fetchActivityList({ categoryId, ...params });
    }
  }, [categoryId, searchParams, fetchActivityList]);

  // 处理表单提交
  const handleSubmit = (values) => {
    // 构建新的URL参数
    const newParams = {};

    if (values.status && values.status.length > 0)
      newParams.status = values.status.join(',');
    if (values.dateRange) {
      newParams.startTime = values.dateRange[0].toISOString();
      newParams.endTime = values.dateRange[1].toISOString();
    }
    if (values.keyword) newParams.keyword = values.keyword;
    if (values.creator) newParams.creator = values.creator;

    // 重置到第一页
    newParams.page = 1;
    newParams.pageSize = pageSize;

    // 更新URL参数
    setSearchParams(newParams);
    setCurrentPage(1);
  };

  // 处理表单重置
  const handleReset = () => {
    // 重置表单时，恢复默认参数
    const defaultParams = { status: 'ongoing', page: 1, pageSize: 10 };

    setSearchParams(defaultParams);
    setCurrentPage(1);
    setPageSize(10);
  };

  // 处理查看详情编辑
  const handleDetailEdit = (record) => {
    // 导航到详情页面
    navigate(`/activity/${categoryId}/detail/${record.id}`);
  };

  // 表格列定义
  const columns = [
    {
      title: '活动标题',
      dataIndex: 'title',
      width: 200,
      render: (text) => {
        return <div>{text}</div>;
      },
    },
    {
      title: '活动状态',
      dataIndex: 'status',
      width: 120,
      render: (text) => {
        const config = statusConfig[text] || unknownStatus;
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      width: 200,
      render: (value) => {
        return formatDateTime(value);
      },
    },
    {
      title: '活动时间',
      dataIndex: 'startTime',
      width: 300,
      render: (text, record) => {
        if (!record.startTime || !record.endTime) return '-';
        const start = formatDateTime(record.startTime);
        const end = formatDateTime(record.endTime);
        return `${start} - ${end}`;
      },
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      width: 200,
      render: (text) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar size="small" color="blue" style={{ marginRight: 6 }}>
              {text?.slice(0, 1) || 'U'}
            </Avatar>
            <span style={{ fontSize: 12 }}>{text}</span>
          </div>
        );
      },
    },
    {
      title: '操作',
      dataIndex: 'actions',
      width: 150,
      render: (text, record) => {
        return (
          <Button
            theme="borderless"
            type="primary"
            onClick={() => handleDetailEdit(record)}
          >
            查看详情 & 编辑
          </Button>
        );
      },
    },
  ];

  // 构建新的URL参数对象
  const copyParams = () => {
    const newParams = {};
    for (const [key, value] of searchParams.entries()) {
      newParams[key] = value;
    }
    return newParams;
  };

  // 分页配置
  const pagination = {
    currentPage,
    pageSize,
    total,
    showSizeChanger: true,
    popoverPosition: 'top',
    onPageChange: (page) => {
      setCurrentPage(page);
      // 更新URL参数
      const newParams = copyParams();
      newParams.page = page;
      setSearchParams(newParams);
    },
    onPageSizeChange: (size) => {
      setPageSize(size);
      setCurrentPage(1);
      const newParams = copyParams();
      newParams.page = 1;
      newParams.pageSize = size;
      setSearchParams(newParams);
    },
  };

  return (
    <div className="activity-list">
      <ActivitySearchForm
        formConfig={formConfig}
        initialValues={getInitialValues()}
        onSearch={handleSubmit}
        onReset={handleReset}
        loading={loading}
      />

      <Table
        columns={columns}
        dataSource={activityList}
        loading={loading}
        pagination={pagination}
        scroll={{ y: 480 }}
      />
    </div>
  );
};

export default ActivityList;
