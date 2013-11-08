module.exports = {
  mongodb: {
    // uri: 'mongodb://172.27.6.7:27020/ipresst, mongodb://10.137.10.239:27017, mongodb://10.137.10.239:27018'
    // uri: 'mongodb://127.0.0.1:27017/expressAdmain',

    // collection: {
    //   Node: {
    //     schema: {
    //       name: {type: String},
    //       value: {type: String}
    //     },
    //     option: {
    //       collection: 'node'
    //     }
    //   },
    //   Express: {
    //     schema: {
    //       title: {type: String},
    //       type: {type: String}
    //     },
    //     option: {
    //       collection: 'express'
    //     }
    //   },
    //   Mongodb: {
    //     schema: {
    //       title: {type: String},
    //       type: {type: String}
    //     },
    //     option: {
    //       collection: 'mongodb'
    //     }
    //   }
    // }
    uri: 'mongodb://127.0.0.1:27017/ipresst',

    collection: {
      Type: {
        schema: {
          name: {type: String, label: '名称'},
          value: {type: String, label: '值'}
        },
        option: {
          collection: 'type',
          label: '类型',
          search: ['name', 'value']
        }
      },
      Work: {
        schema: {
          isPublic: {type: Boolean, label: '公开'},
          title: {type: String, label: '标题'},
          type: {type: String, label: '类别'},
          master: {type: String, label: '主作者'},
          author: {type: [String], label: '作者'},
          like: {type: [String], label: '喜欢的人'}
        },
        option: {
          collection: 'work',
          label: '作品',
          search: ['title', 'type']
        }
      }
    }
  }
};