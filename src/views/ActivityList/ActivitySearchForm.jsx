import { Form, Button, Select, Space } from '@douyinfe/semi-ui';
import { IconSearch, IconRefresh } from '@douyinfe/semi-icons';

const ActivitySearchForm = ({
  formConfig,
  initialValues,
  onSearch,
  onReset,
  loading,
}) => {
  // 渲染表单项的函数
  const renderFormItem = (item) => {
    switch (item.type) {
      case 'input':
        return (
          <Form.Input
            key={item.field}
            field={item.field}
            label={item.label}
            style={item.style}
            placeholder={item.placeholder}
            {...item.props}
          />
        );
      case 'select':
        return (
          <Form.Select
            key={item.field}
            field={item.field}
            label={item.label}
            style={item.style}
            placeholder={item.placeholder}
            {...item.props}
          >
            {item.options?.map((option) => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Form.Select>
        );
      case 'datePicker':
        return (
          <Form.DatePicker
            key={item.field}
            field={item.field}
            label={item.label}
            style={item.style}
            placeholder={item.placeholder}
            {...item.props}
          />
        );
      case 'multiSelect':
        return (
          <Form.Select
            key={item.field}
            field={item.field}
            label={item.label}
            style={item.style}
            placeholder={item.placeholder}
            multiple
            {...item.props}
          >
            {item.options?.map((option) => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Form.Select>
        );
      default:
        return null;
    }
  };

  return (
    <Form initValues={initialValues} style={{ marginBottom: 20 }}>
      {/* eslint-disable-next-line no-unused-vars */}
      {({ formState, values }) => (
        <>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            {formConfig.items.map((item) => renderFormItem(item))}

            <Space
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                paddingBottom: 12,
              }}
            >
              <Button
                loading={loading}
                icon={<IconSearch />}
                theme="solid"
                type="primary"
                style={{ marginRight: 8 }}
                onClick={() => onSearch(values)}
              >
                搜索
              </Button>
              <Button icon={<IconRefresh />} htmlType="reset" onClick={onReset}>
                重置
              </Button>
            </Space>
          </div>
        </>
      )}
    </Form>
  );
};

export default ActivitySearchForm;
