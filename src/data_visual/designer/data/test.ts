import { IDataSourceConfig } from '@data-studio/shared';

export const array: Array<IDataSourceConfig> = [
  {
    id: 'zhuanyunzhongxin',
    displayName: '转运中心排名',
    comment: '没有任何建议',
    metaData: {
      dataType: 'array',
      dimensions: [
        {
          name: 'name',
          type: 'ordinal',
        }, {
          name: 'score',
          type: 'int',
        }, {
          name: 'province',
          type: 'ordinal',
        }],
    },
    generatorPath: 'mock$mockStatic',
    generatorParams: {
      data: {
        dimensions: [
          {
            name: 'name',
            type: 'ordinal',
          }, {
            name: 'score',
            type: 'int',
          }, {
            name: 'province',
            type: 'ordinal',
          }],
        source: [
          {
            score: 4,
            name: '南昌转运中心',
            province: '江西',
          }, {
            score: 13,
            name: '广州转运中心',
            province: '广东',

          }, {
            score: 25,
            name: '杭州转运中心',
            province: '浙江',
          }, {
            score: 29,
            name: '宁夏转运中心',
            province: '宁夏',
          }, {
            score: 38,
            name: '兰州转运中心',
            province: '甘肃',
          }, {
            score: 44,
            name: '南宁转运中心',
            province: '广西',
          }, {
            score: 50,
            name: '长沙转运中心',
            province: '湖南',
          }, {
            score: 52,
            name: '武汉转运中心',
            province: '湖北',
          }, {
            score: 60,
            name: '北京转运中心',
            province: '北京',
          }, {
            score: 72,
            name: '贵州转运中心',
            province: '贵州',
          },
        ],
      },
    },
  },
  {
    id: 'simple1',
    displayName: 'ce',
    comment: '没有任何建议',
    metaData: {
      dataType: 'array',
      dimensions: [
        { name: 'CATALOG_NO', type: 'int' },
        { name: 'catalog_desc', type: 'ordinal' },
        { name: 'catalog_name', type: 'ordinal' }],
    },
    generatorPath: 'standard$simpleGenerator',
    generatorParams: {
      url: 'http://10.2.72.166:8080/openAPI/ce?ak=d0772860f172400091ab7ea6e2010e55',
      dimensions: [
        { name: 'CATALOG_NO', type: 'int' },
        { name: 'catalog_desc', type: 'ordinal' },
        { name: 'catalog_name', type: 'ordinal' }],
    },
  },
  {
    id: '交易类型交易额统计',
    displayName: '交易类型交易额统计',
    comment: '没有任何建议',
    metaData: {
      dataType: 'array',
      dimensions: [
        { name: 'AMOUNT_SUM', type: 'int' },
        { name: 'TRANS_TYPE_DETAIL', type: 'ordinal' }],
    },
    generatorPath: 'standard$simpleGenerator',
    generatorParams: {
      url: 'http://10.2.72.166:8080/openAPI/demo/amountByType?ak=d0772860f172400091ab7ea6e2010e55',
      dimensions: [
        { name: 'AMOUNT_SUM', type: 'int' },
        { name: 'TRANS_TYPE_DETAIL', type: 'ordinal' }],
    },
  },
  {
    id: '杭州地区网点交易量',
    displayName: '杭州地区网点交易量',
    comment: '没有任何建议',
    metaData: {
      dataType: 'array',
      dimensions: [
        { name: '交易量', type: 'int' },
        { name: 'ORG_NO', type: 'ordinal' }],
    },
    generatorPath: 'standard$simpleGenerator',
    generatorParams: {
      url: 'http://10.2.72.166:8080/openAPI/hangzhou/netpoint/trans/count?ak=d0772860f172400091ab7ea6e2010e55',
      dimensions: [
        { name: '交易量', type: 'int' },
        { name: 'ORG_NO', type: 'ordinal' }],
    },
  },
  {
    id: '网点case量TOP10（近一年）',
    displayName: '网点case量TOP10（近一年）',
    comment: '没有任何建议',
    metaData: {
      dataType: 'array',
      dimensions: [
        { name: 'case量', type: 'int' },
        { name: 'ORG_NAME', type: 'ordinal' }],
    },
    generatorPath: 'standard$simpleGenerator',
    generatorParams: {
      url: 'http://10.2.72.166:8080/openAPI/netpoint/case/count/top10?ak=d0772860f172400091ab7ea6e2010e55',
      dimensions: [
        { name: 'case量', type: 'int' },
        { name: 'ORG_NAME', type: 'ordinal' }],
    },
  },
  {
    id: '网点日均交易量Top10（17年）',
    displayName: '网点日均交易量Top10（17年）',
    comment: '没有任何建议',
    metaData: {
      dataType: 'array',
      dimensions: [
        { name: '交易量', type: 'int' },
        { name: 'ORG_NAME', type: 'ordinal' }],
    },
    generatorPath: 'standard$simpleGenerator',
    generatorParams: {
      url: 'http://10.2.72.166:8080/openAPI/netpoint/day/count/top10?ak=d0772860f172400091ab7ea6e2010e55',
      dimensions: [
        { name: '交易量', type: 'int' },
        { name: 'ORG_NAME', type: 'ordinal' }],
    },
  },
  {
    id: '设备效益Top（近一年）',
    displayName: '设备效益Top（近一年）',
    comment: '没有任何建议',
    metaData: {
      dataType: 'array',
      dimensions: [
        { name: '设备效益', type: 'int' },
        { name: 'DEV_NO', type: 'ordinal' }],
    },
    generatorPath: 'standard$simpleGenerator',
    generatorParams: {
      url: 'http://10.2.72.166:8080/openAPI/atm/benefit/lastYear/top5?ak=d0772860f172400091ab7ea6e2010e55',
      dimensions: [
        { name: '设备效益', type: 'int' },
        { name: 'DEV_NO', type: 'ordinal' }],
    },
  },
  {
    id: '设备自助渠道年交易量',
    displayName: '设备自助渠道年交易量',
    comment: '没有任何建议',
    metaData: {
      dataType: 'array',
      dimensions: [
        { name: '交易量', type: 'int' },
        { name: 'TRANS_YEAR', type: 'ordinal' }],
    },
    generatorPath: 'standard$simpleGenerator',
    generatorParams: {
      url: 'http://10.2.72.166:8080/openAPI/atm/year/count?ak=d0772860f172400091ab7ea6e2010e55',
      dimensions: [
        { name: '交易量', type: 'int' },
        { name: 'TRANS_YEAR', type: 'ordinal' }],
    },
  },
  {
    id: '设备自助渠道年交易额',
    displayName: '设备自助渠道年交易额',
    comment: '没有任何建议',
    metaData: {
      dataType: 'array',
      dimensions: [
        { name: '交易额', type: 'int' },
        { name: 'TRANS_YEAR', type: 'ordinal' }],
    },
    generatorPath: 'standard$simpleGenerator',
    generatorParams: {
      url: 'http://10.2.72.166:8080/openAPI/atm/year/amount/count?ak=d0772860f172400091ab7ea6e2010e55',
      dimensions: [
        { name: '交易额', type: 'int' },
        { name: 'TRANS_YEAR', type: 'ordinal' }],
    },
  },
  {
    id: 'simple2',
    displayName: 'ceshi2',
    comment: '没有任何建议',
    metaData: {
      dataType: 'array',
      dimensions: [
        { name: 'CLASSIFICATION', type: 'int' },
        { name: 'DRIVER_CLASS', type: 'ordinal' },
        { name: 'NAME', type: 'ordinal' },
        { name: 'NO', type: 'ordinal' }],
    },
    generatorPath: 'standard$simpleGenerator',
    generatorParams: {
      url: 'http://10.2.72.166:8080/openAPI/ceshi1?ak=d0772860f172400091ab7ea6e2010e55',
      dimensions: [
        { name: 'CLASSIFICATION', type: 'int' },
        { name: 'DRIVER_CLASS', type: 'ordinal' },
        { name: 'NAME', type: 'ordinal' },
        { name: 'NO', type: 'ordinal' }],
    },
  },
  {
    id: 'num1',
    displayName: '产品近三年销售额',
    comment: '没有任何建议',
    metaData: {
      dataType: 'array',
      dimensions: [
        { name: 'product', type: 'ordinal' },
        { name: '2015', type: 'int' },
        { name: '2016', type: 'int' },
        {
          name: '2017', type: 'int',
        }],
    },
    generatorPath: 'mock$mockDynamic',
    generatorParams: {
      intervalTime: 10000,
      dataGenerator: `
              return {
          // 这里指定了维度名的顺序，从而可以利用默认的维度到坐标轴的映射。
          // 如果不指定 dimensions，也可以通过指定 series.encode 完成映射，参见后文。
          dimensions: [
            { name: 'product', type: 'ordinal' },
            { name: '2015', type: 'int' },
            { name: '2016', type: 'int' },
            { name: '2017', type: 'int' }],
          source: [
            { product: '化学', '2015': 43.3, '2016': 85.8, '2017': 93.7 },
            { product: '牛奶', '2015': Math.random() * 100, '2016': 73.4, '2017': 55.1 },
            { product: '吃饭', '2015': Math.random() * 100, '2016': 65.2, '2017': 82.5 },
            { product: '豆子', '2015': Math.random() * 100, '2016': 53.9, '2017': 39.1 },
          ],
        };
      `,
    },
  },
  {
    id: 'num2',
    displayName: '实时销售额',
    comment: '没有任何建议',
    metaData: {
      dataType: 'single',
    },
    generatorPath: 'mock$mockDynamic',
    generatorParams: {
      intervalTime: 10000,
      dataGenerator: `
              console.log('实时销售额');
        return Math.floor(Math.random() * 10000000);
      `,
    },
  },
  {
    id: 'num3',
    displayName: '985高校17年毕业生统计',
    comment: '没有任何建议',
    metaData: {
      dataType: 'array',
      dimensions: [
        {
          name: '学校',
          type: 'ordinal',
        }, {
          name: '省份',
          type: 'ordinal',
        }, {
          name: '城市',
          type: 'ordinal',
        }, {
          name: '本科毕业生人数',
          type: 'int',
        }, {
          name: '硕士毕业生人数',
          type: 'int',
        }, {
          name: '博士毕业生人数',
          type: 'int',
        }, {
          name: '毕业生人数',
          type: 'int',
        }],
    },
    generatorPath: 'mock$mockDynamic',
    generatorParams: {
      intervalTime: 10000,
      dataGenerator: `
      return {
          dimensions: [
            {
              name: '学校',
              type: 'ordinal',
            }, {
              name: '省份',
              type: 'ordinal',
            }, {
              name: '城市',
              type: 'ordinal',
            }, {
              name: '本科毕业生人数',
              type: 'int',
            }, {
              name: '硕士毕业生人数',
              type: 'int',
            }, {
              name: '博士毕业生人数',
              type: 'int',
            }, {
              name: '毕业生人数',
              type: 'int',
            }],
          source: [
            {
              '学校': '北京大学',
              '省份': '北京市',
              '城市': '北京市',
              '本科毕业生人数': '2645',
              '硕士毕业生人数': '3604',
              '博士毕业生人数': '1213',
              '毕业生人数': '7462',
            },
            {
              '学校': '北京航空航天大学',
              '省份': '北京市',
              '城市': '北京市',
              '本科毕业生人数': '3105',
              '硕士毕业生人数': '2845',
              '博士毕业生人数': '437',
              '毕业生人数': '6387',
            },
            {
              '学校': '北京理工大学',
              '省份': '北京市',
              '城市': '北京市',
              '本科毕业生人数': '3761',
              '硕士毕业生人数': '2818',
              '博士毕业生人数': '553',
              '毕业生人数': '7132',
            },
            {
              '学校': '北京师范大学',
              '省份': '北京市',
              '城市': '北京市',
              '本科毕业生人数': '2455',
              '硕士毕业生人数': '3476',
              '博士毕业生人数': '623',
              '毕业生人数': '6554',
            },
            {
              '学校': '大连理工大学',
              '省份': '辽宁省',
              '城市': '大连市',
              '本科毕业生人数': '5608',
              '硕士毕业生人数': '2689',
              '博士毕业生人数': '273',
              '毕业生人数': '8570',
            },
            {
              '学校': '电子科技大学',
              '省份': '四川省',
              '城市': '成都市',
              '本科毕业生人数': '4992',
              '硕士毕业生人数': '3433',
              '博士毕业生人数': '274',
              '毕业生人数': '8699',
            },
            {
              '学校': '东北大学',
              '省份': '辽宁省',
              '城市': '沈阳市',
              '本科毕业生人数': '4724',
              '硕士毕业生人数': '3219',
              '博士毕业生人数': '344',
              '毕业生人数': '8287',
            },
            {
              '学校': '东南大学',
              '省份': '江苏省',
              '城市': '南京市',
              '本科毕业生人数': '4101',
              '硕士毕业生人数': '3801',
              '博士毕业生人数': '1111',
              '毕业生人数': '9013',
            },
            {
              '学校': '复旦大学',
              '省份': '上海市',
              '城市': '上海市',
              '本科毕业生人数': '2789',
              '硕士毕业生人数': '3532',
              '博士毕业生人数': '1230',
              '毕业生人数': '7551',
            },
            {
              '学校': '哈尔滨工业大学',
              '省份': '黑龙江省',
              '城市': '哈尔滨市',
              '本科毕业生人数': '3974',
              '硕士毕业生人数': '3047',
              '博士毕业生人数': '538',
              '毕业生人数': '7559',
            },
            {
              '学校': '湖南大学',
              '省份': '湖南省',
              '城市': '长沙市',
              '本科毕业生人数': '4911',
              '硕士毕业生人数': '3129',
              '博士毕业生人数': '218',
              '毕业生人数': '8258',
            },
            {
              '学校': '华东师范大学',
              '省份': '上海市',
              '城市': '上海市',
              '本科毕业生人数': '3345',
              '硕士毕业生人数': '2904',
              '博士毕业生人数': '495',
              '毕业生人数': '6744',
            },
            {
              '学校': '华南理工大学',
              '省份': '广东省',
              '城市': '广州市',
              '本科毕业生人数': '6223',
              '硕士毕业生人数': '3462',
              '博士毕业生人数': '310',
              '毕业生人数': '9995',
            },
            {
              '学校': '华中科技大学',
              '省份': '湖北省',
              '城市': '武汉市',
              '本科毕业生人数': '7112',
              '硕士毕业生人数': '5217',
              '博士毕业生人数': '1140',
              '毕业生人数': '13469',
            },
            {
              '学校': '吉林大学',
              '省份': '吉林省',
              '城市': '长春市',
              '本科毕业生人数': '10043',
              '硕士毕业生人数': '5340',
              '博士毕业生人数': '904',
              '毕业生人数': '16287',
            },
            {
              '学校': '兰州大学',
              '省份': '甘肃省',
              '城市': '兰州市',
              '本科毕业生人数': '4481',
              '硕士毕业生人数': '2752',
              '博士毕业生人数': '319',
              '毕业生人数': '7552',
            },
            {
              '学校': '南京大学',
              '省份': '江苏省',
              '城市': '南京市',
              '本科毕业生人数': '3060',
              '硕士毕业生人数': '3813',
              '博士毕业生人数': '948',
              '毕业生人数': '7821',
            },
            {
              '学校': '南开大学',
              '省份': '天津市',
              '城市': '天津市',
              '本科毕业生人数': '3252',
              '硕士毕业生人数': '2982',
              '博士毕业生人数': '747',
              '毕业生人数': '6981',
            },
            {
              '学校': '清华大学',
              '省份': '北京市',
              '城市': '北京市',
              '本科毕业生人数': '3119',
              '硕士毕业生人数': '2554',
              '博士毕业生人数': '1385',
              '毕业生人数': '7058',
            },
            {
              '学校': '厦门大学',
              '省份': '福建省',
              '城市': '厦门市',
              '本科毕业生人数': '4504',
              '硕士毕业生人数': '2727',
              '博士毕业生人数': '210',
              '毕业生人数': '7441',
            },
            {
              '学校': '山东大学',
              '省份': '山东省',
              '城市': '济南市',
              '本科毕业生人数': '6697',
              '硕士毕业生人数': '4045',
              '博士毕业生人数': '598',
              '毕业生人数': '11340',
            },
            {
              '学校': '上海交通大学',
              '省份': '上海市',
              '城市': '上海市',
              '本科毕业生人数': '3600',
              '硕士毕业生人数': '3730',
              '博士毕业生人数': '1265',
              '毕业生人数': '8595',
            },
            {
              '学校': '四川大学',
              '省份': '四川省',
              '城市': '成都市',
              '本科毕业生人数': '8836',
              '硕士毕业生人数': '5081',
              '博士毕业生人数': '1138',
              '毕业生人数': '15055',
            },
            {
              '学校': '天津大学',
              '省份': '天津市',
              '城市': '天津市',
              '本科毕业生人数': '3945',
              '硕士毕业生人数': '3444',
              '博士毕业生人数': '542',
              '毕业生人数': '7931',
            },
            {
              '学校': '同济大学',
              '省份': '上海市',
              '城市': '上海市',
              '本科毕业生人数': '3995',
              '硕士毕业生人数': '3492',
              '博士毕业生人数': '648',
              '毕业生人数': '8135',
            },
            {
              '学校': '武汉大学',
              '省份': '湖北省',
              '城市': '武汉市',
              '本科毕业生人数': '6850',
              '硕士毕业生人数': '4992',
              '博士毕业生人数': '1033',
              '毕业生人数': '12875',
            },
            {
              '学校': '西安交通大学',
              '省份': '陕西省',
              '城市': '西安市',
              '本科毕业生人数': '3607',
              '硕士毕业生人数': '2960',
              '博士毕业生人数': '729',
              '毕业生人数': '7296',
            },
            {
              '学校': '西北工业大学',
              '省份': '陕西省',
              '城市': '西安市',
              '本科毕业生人数': '3585',
              '硕士毕业生人数': '2445',
              '博士毕业生人数': '369',
              '毕业生人数': '6399',
            },
            {
              '学校': '浙江大学',
              '省份': '浙江省',
              '城市': '杭州市',
              '本科毕业生人数': '5493',
              '硕士毕业生人数': '4360',
              '博士毕业生人数': '1575',
              '毕业生人数': '11428',
            },
            {
              '学校': '中国海洋大学',
              '省份': '山东省',
              '城市': '青岛市',
              '本科毕业生人数': '3716',
              '硕士毕业生人数': '2155',
              '博士毕业生人数': '271',
              '毕业生人数': '6142',
            },
            {
              '学校': '中国科学技术大学',
              '省份': '安徽省',
              '城市': '合肥市',
              '本科毕业生人数': '1806',
              '硕士毕业生人数': '2835',
              '博士毕业生人数': '894',
              '毕业生人数': '5535',
            },
            {
              '学校': '中国农业大学',
              '省份': '北京市',
              '城市': '北京市',
              '本科毕业生人数': '2742',
              '硕士毕业生人数': '1716',
              '博士毕业生人数': '692',
              '毕业生人数': '5150',
            },
            {
              '学校': '中国人民大学',
              '省份': '北京市',
              '城市': '北京市',
              '本科毕业生人数': '3045',
              '硕士毕业生人数': '3400',
              '博士毕业生人数': '758',
              '毕业生人数': '7203',
            },
            {
              '学校': '中南大学',
              '省份': '湖南省',
              '城市': '长沙市',
              '本科毕业生人数': '7916',
              '硕士毕业生人数': '4375',
              '博士毕业生人数': '971',
              '毕业生人数': '13262',
            },
            {
              '学校': '中山大学',
              '省份': '广东省',
              '城市': '广州市',
              '本科毕业生人数': '6910',
              '硕士毕业生人数': '3666',
              '博士毕业生人数': '938',
              '毕业生人数': '11514',
            },
            {
              '学校': '重庆大学',
              '省份': '重庆市',
              '城市': '重庆市',
              '本科毕业生人数': '6758',
              '硕士毕业生人数': '3741',
              '博士毕业生人数': '455',
              '毕业生人数': '10954',
            },
            {
              '学校': '西北农林科技大学',
              '省份': '陕西省',
              '城市': '咸阳市',
              '本科毕业生人数': '5364',
              '硕士毕业生人数': '1941',
              '博士毕业生人数': '293',
              '毕业生人数': '7598',
            },
            {
              '学校': '中央民族大学',
              '省份': '北京市',
              '城市': '北京市',
              '本科毕业生人数': '2799',
              '硕士毕业生人数': '1229',
              '博士毕业生人数': '165',
              '毕业生人数': '4193',
            },

          ],
        };
      `,
    },
  },
  {
    id: 'num4',
    displayName: '紫金大数据及金库条线绩效',
    comment: '没有任何建议',
    metaData: {
      dataType: 'array',
      dimensions: [
        {
          name: '姓名',
          type: 'ordinal',
        }, {
          name: '绩效',
          type: 'int',
        }],
    },
    generatorPath: 'mock$mockStatic',
    generatorParams: {
      data: {
        dimensions: [
          {
            name: '姓名',
            type: 'ordinal',
          }, {
            name: '绩效',
            type: 'int',
          }],
        source: [
          { '姓名': '李爱东', '绩效': '29.57' },
          { '姓名': '王志发', '绩效': '28' },
          { '姓名': '刘健', '绩效': '26.44' },
          { '姓名': '徐全发', '绩效': '26' },
          { '姓名': '刘发浪', '绩效': '22.75' },
          { '姓名': '吴磊', '绩效': '22.74' },
          { '姓名': '沈晨', '绩效': '22.29' },
          { '姓名': '孙强', '绩效': '22.04' },
          { '姓名': '梁占永', '绩效': '21.64' },
          { '姓名': '洪玮', '绩效': '20.4' },
          { '姓名': '王超（二部）', '绩效': '20' },
          { '姓名': '陈强', '绩效': '19.8' },
          { '姓名': '田宇航', '绩效': '18.52' },
          { '姓名': '尉彬', '绩效': '18.3' },
          { '姓名': '刘渊', '绩效': '17.41' },
          { '姓名': '赵晓', '绩效': '16.99' },
          { '姓名': '沈星', '绩效': '16.68' },
          { '姓名': '张衡', '绩效': '16.51' },
          { '姓名': '刘航', '绩效': '13.94' },
          { '姓名': '杨志勇', '绩效': '13.75' },
          { '姓名': '丁慧姝', '绩效': '12.94' },
          { '姓名': '姜卫岗', '绩效': '12.64' },
          { '姓名': '葛东', '绩效': '12.35' },
          { '姓名': '曾超群', '绩效': '11.53' },
          { '姓名': '刘春传', '绩效': '11.27' },
          { '姓名': '陈宇祥', '绩效': '11.07' },
          { '姓名': '韩海全', '绩效': '11' },
          { '姓名': '杨光02', '绩效': '10.8' },
          { '姓名': '张峰01', '绩效': '10.74' },
          { '姓名': '朱才煜', '绩效': '9.36' },
          { '姓名': '王元', '绩效': '9' },
          { '姓名': '李容', '绩效': '8.33' },
          { '姓名': '葛瑞莲', '绩效': '7.37' },
          { '姓名': '张锦盛', '绩效': '6.1' },
          { '姓名': '周灵芝', '绩效': '0.9' },
        ],
      },
    },
  },
];
