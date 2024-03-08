const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
Page({
  data: {
    loginAccountError: '',
    loginPasswordError: '',
    registerAccountError: '',
    nicknameError: '',
    registerPasswordError: '',
    repeatPasswordError: '',
    phoneNumberError: '',
    isLogin: true, // 初始状态为登录页面
    showLoginPassword: false,
    showRegisterPassword: false,
    showRepeatPassword: false,
    account: '',
    password: '',
    nickname: {
      cursor: null,
      value: ''
    },
    repeatPassword: '',
    phoneNumber: '',
    avatarUrl: defaultAvatarUrl,
  },
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail
    this.setData({
      avatarUrl,
    })
    this.uploadAvatar(e.detail.avatarUrl);
  },
  onClickLeft() {
    wx.switchTab(
      { url: '../index/index' }
    )
  },
  uploadAvatar(tempFilePath) {
    wx.uploadFile({
      url: 'http://localhost:3002/uploadavatar', // 替换为你的服务器端点
      filePath: tempFilePath,
      name: 'file', // 与服务器端 multer.single('file') 匹配
      success: (res) => {
        const data = JSON.parse(res.data);
        const avatarUrl = data.url; // 假设你的服务器以上传的头像URL响应
        this.setData({
          avatarUrl,
        });
      },
      fail: (error) => {
        console.error('上传头像失败：', error);
      },
    });
  },

  // 切换到注册页面
  switchToRegister() {
    this.setData({
      isLogin: false,
      showLoginPassword: false,
      showRegisterPassword: false,
      showRepeatPassword: false,
      loginAccountError: '',
      loginPasswordError: '',
      registerAccountError: '',
      nicknameError: '',
      registerPasswordError: '',
      repeatPasswordError: '',
      phoneNumberError: '',
      account: '',
      password: '',
      nickname: {
        cursor: null,
        value: ''
      },
      repeatPassword: '',
      phoneNumber: '',
      avatarUrl: defaultAvatarUrl,
    });

  },

  // 切换到登录页面
  switchToLogin() {
    this.setData({
      isLogin: true,
      showLoginPassword: false,
      showRegisterPassword: false,
      showRepeatPassword: false,
      loginAccountError: '',
      loginPasswordError: '',
      registerAccountError: '',
      nicknameError: '',
      registerPasswordError: '',
      repeatPasswordError: '',
      phoneNumberError: '',
      account: '',
      password: '',
      nickname: {
        cursor: null,
        value: ''
      },
      repeatPassword: '',
      phoneNumber: '',
      avatarUrl: defaultAvatarUrl,
    });
  },

  // 输入账号
  onAccountInput(event) {
    this.setData({
      account: event.detail
    });
  },

  nicknameInput(event) {
    this.setData({
      nickname: event.detail
    });
  },

  // 输入密码
  onPasswordInput(event) {
    this.setData({
      password: event.detail
    });
  },

  // 输入重复密码
  onRepeatPasswordInput(event) {
    this.setData({
      repeatPassword: event.detail
    });
  },

  // 输入手机号
  onPhoneNumberInput(event) {
    this.setData({
      phoneNumber: event.detail
    });
  },

  // 点击登录按钮
  // 点击登录按钮
  onLogin() {
    // 验证逻辑
    let valid = true; // 用于标记是否通过验证

    if (!this.data.account) {
      this.setData({
        loginAccountError: '请输入账号'
      });
      valid = false;
    } else if (this.data.account.length < 6 || this.data.account.length > 20) {
      this.setData({
        loginAccountError: '账号长度必须在6到20之间'
      });
      valid = false;
    } else {
      this.setData({
        loginAccountError: ''
      });
    }

    if (!this.data.password) {
      this.setData({
        loginPasswordError: '请输入密码'
      });
      valid = false;
    } else if (this.data.password.length < 6 || this.data.password.length > 20) {
      this.setData({
        loginPasswordError: '密码长度必须在6到20之间'
      });
      valid = false;
    } else {
      this.setData({
        loginPasswordError: ''
      });
    }

    // 如果通过了所有验证
    if (valid) {
      const { account, password } = this.data;
      // 编写登录逻辑
      wx.request({
        url: 'http://localhost:3002/login', // 后端登录接口地址
        method: 'POST',
        data: {
          account,
          password,
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: (res) => {
          console.log(res.data);
          if (res.data.error) {
            // 注册失败时，显示错误信息
            wx.showToast({
              title: res.data.error,
              icon: 'none',
              duration: 2000,
            });
          } else {
            // 注册成功的处理逻辑
            const { _id } = res.data; // 假设注册成功后后端返回用户信息，包含 _id
            wx.setStorageSync('_id', _id);
            // 跳转到其他页面或进行其他操作
            wx.navigateBack({
              delta: 1,
            });
            wx.showToast({
              title: '登录成功',
              icon: 'success',
              duration: 1000
            })
          }
        },
        fail: (error) => {
          console.error('登录请求失败：', error);
          // 登录失败时，显示错误信息
          wx.showToast({
            title: '登录失败，请检查用户名和密码',
            icon: 'none',
            duration: 2000,
          });
        },
      });

    }
  },

  onRepeatPasswordBlur() {
    // 在重复密码框失去焦点时进行验证
    let valid = true; // 用于标记是否通过验证

    if (!this.data.repeatPassword) {
      this.setData({
        repeatPasswordError: '请再次输入密码'
      });
      valid = false;
    } else {
      this.setData({
        repeatPasswordError: ''
      });
    }

    if (this.data.password !== this.data.repeatPassword) {
      this.setData({
        repeatPasswordError: '两次输入的密码不一致'
      });
      valid = false;
    }

    // 如果通过了所有验证
    if (valid) {
      console.log('重复密码验证通过');
    }
  },

  // 点击注册按钮
  onRegister() {
    // 验证逻辑
    let valid = true; // 用于标记是否通过验证
    if (!this.data.nickname.value || this.data.nickname.value == '') {
      this.setData({
        nicknameError: '请输入昵称'
      });
      valid = false;
    } else if (this.data.nickname.value.length < 2 || this.data.nickname.value.length > 20) {
      this.setData({
        nicknameError: '昵称长度必须在2到20之间'
      });
      valid = false;
    } else {
      this.setData({
        nicknameError: ''
      });
    }

    if (!this.data.account) {
      this.setData({
        registerAccountError: '请输入账号'
      });
      valid = false;
    } else if (this.data.account.length < 6 || this.data.account.length > 20) {
      this.setData({
        registerAccountError: '账号长度必须在6到20之间'
      });
      valid = false;
    } else {
      this.setData({
        registerAccountError: ''
      });
    }

    if (!this.data.password) {
      this.setData({
        registerPasswordError: '请输入密码'
      });
      valid = false;
    } else if (this.data.password.length < 6 || this.data.password.length > 20) {
      this.setData({
        registerPasswordError: '密码长度必须在6到20之间'
      });
      valid = false;
    } else {
      this.setData({
        registerPasswordError: ''
      });
    }

    if (!this.data.repeatPassword) {
      this.setData({
        repeatPasswordError: '请再次输入密码'
      });
      valid = false;
    } else {
      this.setData({
        repeatPasswordError: ''
      });
    }

    if (this.data.password !== this.data.repeatPassword) {
      this.setData({
        repeatPasswordError: '两次输入的密码不一致'
      });
      valid = false;
    }

    if (!this.data.phoneNumber) {
      this.setData({
        phoneNumberError: '请输入手机号'
      });
      valid = false;
    } else if (!/^\d{11}$/.test(this.data.phoneNumber)) {
      this.setData({
        phoneNumberError: '手机号格式不正确'
      });
      valid = false;
    } else {
      this.setData({
        phoneNumberError: ''
      });
    }

    // 如果通过了所有验证
    if (valid) {
      // 编写注册逻辑
      console.log('注册', this.data.avatarUrl, this.data.nickname, this.data.account, this.data.password, this.data.phoneNumber);
      const userInfo = {
        username: this.data.account,
        nickname: this.data.nickname.value,
        headSculpture: this.data.avatarUrl,
        password: this.data.password,
        phone: this.data.phoneNumber,
        // 其他字段根据需要添加
      };

      // 发送注册请求到后端
      wx.request({
        url: 'http://localhost:3002/register', // 后端注册接口地址
        method: 'POST',
        data: userInfo,
        header: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        success: (res) => {
          console.log(res.data);
          if (res.data.error) {
            // 注册失败时，显示错误信息
            wx.showToast({
              title: res.data.error,
              icon: 'none',
              duration: 2000,
            });
          } else {
            // 注册成功的处理逻辑
            const { _id } = res.data;
            wx.setStorageSync('_id', _id);
            // 跳转到其他页面或进行其他操作
            wx.navigateBack({
              delta: 1,
            });
            wx.showToast({
              title: '注册成功',
              icon: 'success',
              duration: 1000
            })
          }
        },
        fail: (error) => {
          console.error('注册请求失败：', error);
          // 注册失败时，显示错误信息
          wx.showToast({
            title: '注册失败，请重试',
            icon: 'none',
            duration: 2000,
          });
        },
      });
    }
  },
  // 切换登录密码显示
  toggleShowLoginPassword() {
    this.setData({
      showLoginPassword: !this.data.showLoginPassword
    });
  },

  // 切换注册密码显示
  toggleShowRegisterPassword() {
    this.setData({
      showRegisterPassword: !this.data.showRegisterPassword
    });
  },

  // 切换重复密码显示
  toggleShowRepeatPassword() {
    this.setData({
      showRepeatPassword: !this.data.showRepeatPassword
    });
  },
});