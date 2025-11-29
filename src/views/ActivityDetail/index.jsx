import { useState, useEffect } from 'react';
import {
  Button,
  Descriptions,
  Tag,
  Typography,
  Card,
  Input,
  Select,
  DatePicker,
  TextArea,
  Space,
  Skeleton,
  Toast,
} from '@douyinfe/semi-ui';
import {
  IconArrowLeft,
  IconEdit,
  IconSave,
  IconClose,
} from '@douyinfe/semi-icons';
import { useParams, useNavigate } from 'react-router-dom';
import { formatDateTime } from '@/utils/index.js';
import { queryActivityList, updateActivityDetail } from '@/apis';
import { statusConfig, unknownStatus } from '@/constants/index.js';
import './index.css';

const { Title } = Typography;

const ActivityDetail = () => {
  const [activityData, setActivityData] = useState({});
  const [editData, setEditData] = useState({});
  const [editLoading, setEditLoading] = useState(true);
  const [queryLoading, setQueryLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const { categoryId, activityId } = useParams();
  const navigate = useNavigate();

  const fetchDetail = async () => {
    setQueryLoading(true);
    try {
      console.log(categoryId, activityId);
      const res = await queryActivityList({ categoryId, id: activityId });
      // @TODO 有待打磨，当前假设只有一个活动详情
      setActivityData(res[0] || {});
      setEditData(res[0] || {});
      setQueryLoading(false);
    } catch (error) {
      console.error('查询活动详情失败:', error);
    } finally {
      setEditLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [categoryId, activityId]);

  // 处理返回按钮点击
  const handleBack = () => {
    navigate(-1); // 返回上一页
  };

  // 获取状态标签的配置
  const getStatusConfig = (status) => {
    return statusConfig[status] || unknownStatus;
  };

  const handleInputChange = (field, value) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditClick = () => {
    setIsEdit(true);
  };

  const toastOpt = (content) => ({
    duration: 2,
    content,
    theme: 'light',
  });

  const handleSaveClick = async () => {
    console.log('editData', editData);
    // 校验输入，主要做非空校验
    if (
      !editData.title.trim() ||
      !editData.description.trim() ||
      !editData.rules.trim() ||
      !editData.startTime ||
      !editData.endTime
    ) {
      Toast.error(toastOpt('请填写完整活动信息'));
      return;
    }
    setEditLoading(true);
    const res = await updateActivityDetail(activityId, {
      ...editData,
      updatedAt: new Date().toISOString(),
    });
    if (res === '1') {
      Toast.success(toastOpt('更新成功'));
      fetchDetail();
      setIsEdit(false);
    } else {
      Toast.error(toastOpt('更新失败'));
    }
    setEditLoading(false);
  };

  const handleCancelClick = () => {
    setIsEdit(false);
    fetchDetail();
  };

  const placeholder = (height, rows) => {
    return (
      <Skeleton.Paragraph style={{ height: height || 20 }} rows={rows || 2} />
    );
  };

  return (
    <div className="activity-detail">
      <div className="activity-detail-header">
        <Button
          theme="borderless"
          icon={<IconArrowLeft />}
          onClick={handleBack}
        >
          返回
        </Button>
        {isEdit ? (
          <div style={{ display: 'flex' }}>
            <Button
              theme="outline"
              icon={<IconClose />}
              type="secondary"
              onClick={handleCancelClick}
            >
              取消
            </Button>
            <Button
              theme="solid"
              loading={editLoading}
              icon={<IconSave />}
              style={{ marginLeft: 10 }}
              onClick={handleSaveClick}
            >
              保存
            </Button>
          </div>
        ) : (
          <Button
            theme="solid"
            type="primary"
            icon={<IconEdit />}
            onClick={handleEditClick}
          >
            编辑
          </Button>
        )}
      </div>

      <div className="activity-detail-content">
        <Card
          shadows="hover"
          style={{ marginBottom: 20 }}
          className="activity-detail-data"
        >
          <Title heading={4} style={{ marginBottom: 10 }}>
            参与数据
          </Title>
          <Skeleton
            placeholder={placeholder(52, 2)}
            active
            loading={queryLoading}
          >
            <Descriptions row>
              <Descriptions.Item itemKey="参与人数">
                {activityData.participation?.totalParticipants || 0}
              </Descriptions.Item>

              <Descriptions.Item itemKey="最大人数">
                {activityData.participation?.maxParticipants || 0}
              </Descriptions.Item>

              <Descriptions.Item itemKey="报名率">
                {activityData.participation?.conversionRate || 0}
              </Descriptions.Item>
            </Descriptions>
          </Skeleton>
        </Card>

        <Card
          shadows="hover"
          style={{ marginBottom: 20 }}
          className="activity-detail-main"
        >
          <Skeleton
            placeholder={placeholder(278, 10)}
            active
            loading={queryLoading}
          >
            <Descriptions layout="vertical">
              <Descriptions.Item
                itemKey="活动标题"
                className="activity-detail-item"
              >
                {isEdit ? (
                  <Input
                    maxLength={100}
                    defaultValue={activityData.title}
                    style={{ width: 300 }}
                    onChange={(value) => handleInputChange('title', value)}
                  />
                ) : (
                  <Space className="activity-detail-item-content">
                    {activityData.title || '-'}
                  </Space>
                )}
              </Descriptions.Item>

              <Descriptions.Item
                itemKey="活动状态"
                className="activity-detail-item"
              >
                {isEdit ? (
                  <Select
                    defaultValue={activityData.status}
                    style={{ width: 300 }}
                    onChange={(value) => handleInputChange('status', value)}
                  >
                    <Select.Option value="ongoing">进行中</Select.Option>
                    <Select.Option value="upcoming">即将开始</Select.Option>
                    <Select.Option value="ended">已结束</Select.Option>
                  </Select>
                ) : (
                  <Space className="activity-detail-item-content">
                    <Tag color={getStatusConfig(activityData.status).color}>
                      {getStatusConfig(activityData.status).text}
                    </Tag>
                  </Space>
                )}
              </Descriptions.Item>

              <Descriptions.Item
                itemKey="创建人"
                className="activity-detail-item"
              >
                {activityData.creator || '-'}
              </Descriptions.Item>

              <Descriptions.Item
                itemKey="更新时间"
                className="activity-detail-item"
              >
                <Space className="activity-detail-item-content">
                  {formatDateTime(activityData.updatedAt)}
                </Space>
              </Descriptions.Item>

              <Descriptions.Item
                itemKey="开始时间"
                className="activity-detail-item"
              >
                {isEdit ? (
                  <DatePicker
                    type="dateTime"
                    defaultValue={activityData.startTime}
                    style={{ width: 300 }}
                    onChange={(value) => handleInputChange('startTime', value)}
                  />
                ) : (
                  <Space className="activity-detail-item-content">
                    {formatDateTime(activityData.startTime)}
                  </Space>
                )}
              </Descriptions.Item>

              <Descriptions.Item
                itemKey="结束时间"
                className="activity-detail-item"
              >
                {isEdit ? (
                  <DatePicker
                    type="dateTime"
                    defaultValue={activityData.endTime}
                    style={{ width: 300 }}
                    onChange={(value) => handleInputChange('endTime', value)}
                  />
                ) : (
                  <Space className="activity-detail-item-content">
                    {formatDateTime(activityData.endTime)}
                  </Space>
                )}
              </Descriptions.Item>
            </Descriptions>
          </Skeleton>
        </Card>

        <Card shadows="hover" className="activity-detail-desc">
          <Title heading={4} style={{ marginBottom: 10 }}>
            活动描述
          </Title>
          <Skeleton
            placeholder={placeholder(32, 2)}
            active
            loading={queryLoading}
          >
            {isEdit ? (
              <TextArea
                maxCount={1000}
                defaultValue={activityData.description}
                onChange={(value) => handleInputChange('description', value)}
              />
            ) : (
              <Typography.Text
                type="secondary"
                style={{ whiteSpace: 'pre-line', wordBreak: 'break-word' }}
              >
                {activityData.description || '暂无描述'}
              </Typography.Text>
            )}
          </Skeleton>
        </Card>

        <Card
          shadows="hover"
          style={{ marginTop: 20 }}
          className="activity-detail-rule"
        >
          <Title heading={4} style={{ marginBottom: 10 }}>
            参与规则
          </Title>
          <Skeleton
            placeholder={placeholder(32, 2)}
            active
            loading={queryLoading}
          >
            {isEdit ? (
              <TextArea
                maxCount={1000}
                defaultValue={activityData.rules}
                onChange={(value) => handleInputChange('rules', value)}
              />
            ) : (
              <Typography.Text
                type="secondary"
                style={{ whiteSpace: 'pre-line', wordBreak: 'break-word' }}
              >
                {activityData.rules || '暂无规则'}
              </Typography.Text>
            )}
          </Skeleton>
        </Card>
      </div>
    </div>
  );
};

export default ActivityDetail;
