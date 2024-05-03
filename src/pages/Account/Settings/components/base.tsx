import { useModel } from '@umijs/max';

import { Avatar, Button, message, Upload } from 'antd';
import React from 'react';
import { updateUserUsingPost } from '@/services/stephen-backend/userController';
import { ProCard, ProForm, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { UploadOutlined } from '@ant-design/icons';

// 头像组件 方便以后独立，增加裁剪之类的功能
const AvatarView = () => (
  <>
    <Upload showUploadList={false}>
      <Button>
        <UploadOutlined />
        更换头像
      </Button>
    </Upload>
  </>
);



const BaseView: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const currentUser = initialState?.currentUser;

  const getAvatarURL = () => {
    if (currentUser) {
      if (currentUser?.userAvatar) {
        return currentUser.userAvatar;
      }
      return 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
    }
    return '';
  };

  const handleUpdate = async (values: API.UserUpdateRequest) => {
    const hide = message.loading('正在更新');
    console.log(values);
    try {
      await updateUserUsingPost({
        ...values,
        id: currentUser?.id,
      });
      hide();
      message.success('更新成功');
      return true;
    } catch (error: any) {
      hide();
      message.error(`更新失败${error.message}, 请重试!`);
      return false;
    }
  };

  return (
    <ProCard title="更新个人基本信息" extra={new Date().toLocaleDateString()} headerBordered>
      <ProCard title="用户基本信息" colSpan="50%">
        <ProForm
          layout="vertical"
          onFinish={async (values) => {
            await handleUpdate(values);
          }}
          submitter={{
            searchConfig: {
              submitText: '更新基本信息',
            },
            render: (_, dom) => dom[1],
          }}
          initialValues={{
            ...currentUser,
          }}
        >
          <ProFormText width={"md"} colProps={{md: 12, xl: 8}} name="userName" label="用户名"/>
          <ProFormText width={"md"} colProps={{md: 12, xl: 8}} name="userPhone" label="电话"/>
          <ProFormText width={"md"} colProps={{md: 12, xl: 8}} name="userEmail" label="邮箱"/>
          <ProFormTextArea
            width={'md'}
            colProps={{md: 12, xl: 8}}
            name="userProfile"
            label="简介"
          />
        </ProForm>
      </ProCard>
      <ProCard title="更新用户头像">

        <div>
          <Avatar size={120} src={getAvatarURL()}/>
        </div>
        <AvatarView/>
      </ProCard>
    </ProCard>
  );
};
export default BaseView;
