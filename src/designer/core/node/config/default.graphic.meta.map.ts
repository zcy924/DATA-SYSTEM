import * as _ from 'lodash';
import {FlipBarChartGraphic} from '@core/node/graphic/chart/flip.bar.chart.graphic';

interface GraphicMeta {
  region: {
    regionKey: string;
    regionOption?: any;
  };
  graphic: {
    graphicKey: string,
    configOption: any,
    dataOptionId: string
  };
  regionOption?: any;
  grabOption?: {
    width: number,
    height: number,
    backgroundImage: string
  };
  displayName?: string;
  imageClass?: string;
}

interface GraphicMetaMap {
  [key: string]: GraphicMeta;
}


const defaultGraphicMetaMap: Map<string, GraphicMeta> = new Map();


export const stdGraphicMeta: GraphicMetaMap = {
  barChart: {
    region: {
      regionKey: 'explicit.region'
    },
    graphic: {
      graphicKey: 'bar.chart.graphic',
      configOption: null,
      dataOptionId: 'num1'
    }
  },
  lineChart: {
    region: {
      regionKey: 'explicit.region'
    },
    graphic: {
      graphicKey: 'line.chart.graphic',
      configOption: null,
      dataOptionId: 'num3'
    },
    grabOption: {
      width: 300,
      height: 200,
      backgroundImage: 'url("data:image/jpeg;base64,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")',
    },
  },
  pieChart: {
    region: {
      regionKey: 'explicit.region'
    },
    graphic: {
      graphicKey: 'pie.chart.graphic',
      configOption: null,
      dataOptionId: 'num1'
    }
  },
  textAuxiliary: {
    region: {
      regionKey: 'explicit.region'
    },
    graphic: {
      graphicKey: 'text.graphic',
      configOption: null,
      dataOptionId: 'num2'
    }
  },
  commentAuxiliary: {
    region: {
      regionKey: 'comment.region'
    },
    graphic: {
      graphicKey: 'comment.graphic',
      configOption: null,
      dataOptionId: 'num1'
    }
  },
  imageAuxiliary: {
    region: {
      regionKey: 'explicit.region'
    },
    graphic: {
      graphicKey: 'image.graphic',
      configOption: null,
      dataOptionId: 'num1'
    }
  }
};

export const customGraphicMeta: GraphicMetaMap = {
  clock: {
    displayName: '实时时间',
    imageClass: 'baidu-time',
    grabOption: {
      width: 240,
      height: 50,
      backgroundImage: 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPAAAAAyCAYAAABidVYtAAAOa0lEQVR4nO2dCZCUxRXHG1hOQUFEThGNBsEYg8pVFUEkKsSIHAYVS3EFRNBwqSgeIHgQ8eAGleXURC2RU4IiCGpKMCKWkaMsS1EUS+US5VoQN/3r2jfV801/830zu0sxlf5Xbe1OTx+vX7/3+r33vZktt3///iIVgQMHDqhq1apFdfP9fD/f7xj3y4vTEfh+vp/vd/z1Kx+rl4eHx3EJr8AeHjkMr8AeHjkMr8AeHjkMr8AeHjkMr8AeHjkMr8AeHjkMr8AeHjmMPKo5ohCnj+/n+/l+x76fr8Ty/Xy/HO7nXWgPjxyGV2APjxxGXiadjxw5or7++mu1a+dOdaiwUFWpXFnVPuUUddppp6mKFSuWFY0eHh4hiKXA3333nVrw6qtq6ZIl6vDhwynvV6pUSV3VpYvq3qOHOvPMM0udSA8PDzfSKvDRo0eN0o5/+ml19tlnq1GjR6uLLrpInXjiiYk++37+WW346CM1b84cld+7txo6bJhR5goVKpQ58R4e/+8IVWCUd9bMmeqF559XAwYOVD307VpR37RBVK9RQ7Vr1061bdNGLVm6VE2bOlXt2LFD3dKnj1diD48yhlOBi4qK1PLly9XCBQvUuCeeUL877zyn8trg/U6dOqlGDRuq0Q89pOo3aKCuvPJKVa5cuayJ27t3rxp0xx1q06ZNibYbb7pJDbz9dmf/Q4cOqbGPPaZWvPFGou3+Bx5Qf7nqqrTr/Pjjj+ou7Tl07dYtbd/XtIF69JFHEq87duyoHhg5UlWpUiXulpLw5ZdfqqGDB5sQBdStW1dNmDRJNWnSJNb6l19xhRpx331Zr28Dw/v999+HzgePhg0ZorZs2VLi9Vnr+XnzEq/Tnalr3WnTp6sWF1wQay05W1uG0p1btjKUbvy5556rntRebKUQHfpowwY1cMCAxOtmzZqppydMUDVr1oxcr8JDGsHGr776So17/HHVr39/1aFDB/XLL78kJam2bdumht99tzr//PPVSSedlGinH8JXs1YtNWf2bNW6dWsnESTDopJebOqmG280t7mN/378sVq3dq1q17594gCYb/v27aqfvvU/1u/bePedd0zc3rJVq5R1WaN7167qHy+8YNbBk/ht06ZO+hC6KZMnJ7Vt3bpVvfH666pN27Zpme2aD2UcPGiQ2rdvX6Jt//796tX589WFF16o6tevn2hHKB4eM8bw1Mbnn3+u1n/wQRIvota1gXDfob2rJ7WRhq+/OessdfHFF6u8vGS7jqEZoGWB33HWD1tX1lu5cmVSO2uTHG2r+Wivzfn0uu46tXPnzqT+y5YtU/Xq1TNnlW6/QjfnZIPXLrqhb4g+E+TLBjLkoi+4bth4ZGuV3nPLli3VKXXqJL2HXKHwNtgv/ePIVUolFq7zAi1EKCIKePDgwZTKkANa0A4XFprf9nvyN+PWrF5t5sEIBF3pOJUm72imNdUHNFYbEjES3Mj3jxhhrOmqVatU586dTfuePXtUwXPPmZvsuuuvV/1uvdW0b9OG6N577jHWHotNHG/Pg1Xn1muN+794sSrUig5tQfowCsxB379rehqffrppX7xokZo0caJZ+05t0CpXruzcS3A+6CqYMcP8jaXFENrzTda38KNjxyb2jTeERccy046wwNOntOLBh7lz5iT2HJfPMzTNL734ovn7z9pT+nD9enVUG2DO+9dff03qe0i3na73/NT48UZx0p1FunWhk/7cgPALWUMImYf9/V7zQeZhfvgABmkv5WptaAFnwY0M/87SBkfOwrWu0D3tmWeSZGiElgkX3S76hM9B+lx8hnfVq1dXs/U8Qleh1hM5p2WvvZZEb5hcTddKPV/rTiy5KgpAW4ui/N69i1asWJFo44vvbGgLVnRLfr75bcPux3jmYb4ggvO5sOHDD539WLNrly5FIx98sEgzzLRt2bw5pU2wdMmSojatWhVNnTIlMZ9W+KI+mn7es/vI6+C6wfcFu3fvNmsyF3OGIdP5eI/927SyP+F3cB9h66fjM/wQfqXjX7r5oNG1D9e6Llqln8xjr+86N0EY/+LIFXjvvfdSxrMu67v4LDIHLS5ErSvjJ4wfn9TOfPZZC7799tuUMw9bN6WQgzgIq9E04J5kCm67A9oiMV82iBvjgE2bN5vbFxcl6Er+UbuExCCaScb6AtySglmzYsc1UWjYqFHsOBB3+APtvnGTkVuwgaXtWnzTrC12w3DLdu3aZay/3H4C9kHczq2x9YsvMqKZmHO0dstLEj8TtsQF9EHnBTo8CLqFzZo3N/E0rrTkAwjTAG5rEHKm8BF+AlzRjjrcIzSJglaQ2HTbaNy4ceJv3Pu22tMcpWNp9CUd9uzendiXgHNFJtnHGYFHr3gLnCtjNn7ySdq5nQpctWrVpEdF2YBDqn7CCVkrcBiEGbgdInzf6PgENGzYMKU/fVAwlGCvZlo2EIGZWVCQFAfOmzvXuFYoXSYKvP2bb1Tt2rWd8U2tk082igrfRDiPRyDAJNRQvD9ddllkf1F2WwkE8I7z5Fw537IEdD85blwK3dDAOULDbG3chfco2iPa0HFeyEGmQF7GjB5t5Kfntdcm2sUwhxl/kWUxZGFIiciJa+PcKCRc5r/ySlISq5W2SBLPieIwX2mBTWu3wwg4cRuA0Tt++MG0IfxlARSNLCLZzOutQwBkKDPxFuwbNY7SszbCI7dTMEMtB4yCZEJHpkAQSdDYBjld9jgIodNlZF0QRccTaXrOOUnvCQ8B5w8foePm/PyUDwEEM/2APMlgHUcHAf/IcJMRtrPIyNb4iROTDC59177/vvnbjr1dWW/J1tu5BbmILrv88hJ5QSk3cDV9a3JDpLP+lE727NlTffbZZ2rdunXmZ/369SZpIJCbhvlKAzZjRo4aFfqoJQix7iXFv999N+lQBIsWLjS0lRZEYe3XuJ0cNjeBvVbwccyxBmvHcVnjIHgzE16gOKxBEk/gUshMQfLORTcyu2jRopR21vrXsmVZr4cxoKYiE4gnFoWUGxhh36dvTQQlLIVNZo6ySX5s2Jbop59+Mlm50lAeef7Jhl58+eXYygs4lJK68bJ+8LkntwMZUQwLNzT8cllgIGOjYLtWgl433GDiJebsrOcRwA8q36iUk5stav1srT08/+dLLyVuOFEkeS5d0nxC0FVkvT59+5r5cXn5ESB38vgtaj/Ms3Dx4sRr8SSCdNvPb+W5r/yHBNtQRnkckl8RyHkwnoy76+Z3wRU3u5ByA6Nw1XQMzO1aEnz66acmKVMSBSY5QJIAZuOucRBB5eUA65x6apnFTxwAtywxDMpiCwzhAoeNsnBDAzlA3Cv5WbV6dSJhJDdslJdjgzFTpk0zSigQtw4Bs8MHe33WFRpKmrAKgnOYPXeu4UscL0Ru2EwSXygRLq0N5IBHZvDPzoNkQvf0Z59NoXvL5s1GeZk/aIyoKoT3b65YkfIsPAr22a1+663E+NLKdaQocK1atdQfWrRQK998M6nIIBMwjvHMw3zZgE09VVxgwK2bzvI10i49cAmHuPLEnHVjuCRByI3oyp4CcfWikg0CO6nmEnqxvMGMOn+jhKKYGDPWJRMblhAra8he4iBdUka8JFdGlljTNkTIgWS0XQmxbOkW2XFlvenPeWR7SbjCuChDno4eGykKjHvc5eqrTZXNmjVrTFllJqA/4xjPPNnWQxMzbNy40dwyUS5zgwYNzG/7sYJADhsGhj0Qj4MwS0maP5N4zM64uh4RyOOjOMkeuTXCjEtZQ4xjHMiNQygQNFzwAkMdJ3kqcarrMVxp0B12CSBb2cIVxokRcT0CxPOUR41RiVnnd2LVqVNH9erVS02dPFnVqFFDNW/ePBahZKZZmHG4Oczjmj+qEotKJQSTsr5TtXsc1R9LTPUMY07WG7YrsajLRmEuvfTS0HkKiz8i6arEIsvOzcDcVCrZlTH/0TeCxFLcFGHzB9uhhfkYy+ep7UosYiX20uSMMxLjqNhhLdkX7SR2iAupzurWvXtWfBYc1AKG4Q2rxKJqCy+nffv2iTa7mo2sLnW+sp5rXc7xkg4dTAIJuqXSiXnG6DNCiYffe69Zm/EI8TPafe7WrVui/NBe867hw1NkI7iu0G1XT0klFiGeTTdVXcgJZ4IcMEbmYx6phKtXv35qZWLxa86ER5p2VZxdidX+kkuMPEn/TnoN5kVG7UqsWQUFph360sl/2u/EonQNSwlzISjs00iCI3rTlD/OnDFD/bVnTzM+3e2b7jt/DhYXgFBOxk8Y7KL2HtdcY5iEgEiJoIA49RzN/LB/21i5eF/8lvft3331/qX0jp8giJuiXB17XWghJkJZhwWSGlhd1rNDD744wbUv+o7kgyNW3XS6dcNQVd8GfOikQl6eqQEI3oKUbgYTSQL20f+221LGuNZFJiixdfExyMPy5cubmyv/5ptT5qFvj0ACVRJN9gcPMqGbM+nbr58zaSb426BBCV7LBxCYZ8jQoWa/yI/rnACXAAks+1xb6BCT8ShrcJ/0763bos4v9Ct1UD4mGHrnncadHaA3+5YOwsku2+A17bw/acIEdWv//mbcsf4oIYq8XDOCjdtAyUuaIZVMJoJjA4sdFZ+HgTHBBA0WnsRQMGRgbwimDQ4+04x8toDW4N4B9GeSHINWaLaTcYC9BXnInCQNXecZl99hdFN/7qIbOXHJkElAvf125HN2xgfPCdBGYtGumQCS1wiOwQMj8RUnLCpXFCPI/UL76KX5jRy58I+TfT/fLxf6xfpKHVy1u3TMgguQ7jux4sZcHh4epYOMvtQOJeWG9d975eFxfMB/rayHRw7DK7CHRw7DK7CHRw7DK7CHRw7D/3dC38/3y+F+/r8T+n6+Xw738y60h0cOwyuwh0cOwyuwh0cOwyuwh0cOwyuwh0cOwyuwh0cOwyuwh0cOwyuwh0cO43+i02/FdKBVpgAAAABJRU5ErkJggg==")',
    },
    region: {
      regionKey: 'explicit.region',
      regionOption: {
        width: 240,
        height: 50
      }
    },
    graphic: {
      graphicKey: 'clock.graphic',
      configOption: null,
      dataOptionId: 'num1'
    }
  },
  info2: {
    displayName: '数字翻牌器',
    imageClass: 'baidu-chart-flip-number',
    region: {
      regionKey: 'explicit.region',
      regionOption: {
        width: 660,
        height: 120
      }
    },
    graphic: {
      graphicKey: 'flip.number.graphic',
      configOption: null,
      dataOptionId: 'num2'
    }
  },
  table: {
    displayName: '带边框表格',
    imageClass: 'baidu-table',
    region: {
      regionKey: 'explicit.region'
    },
    graphic: {
      graphicKey: 'table.graphic',
      configOption: null,
      dataOptionId: 'num1'
    }
  },
  mapProvince: {
    displayName: '省份数据',
    imageClass: 'baidu-map-province',
    region: {
      regionKey: 'explicit.region',
      regionOption: {
        width: 550,
        height: 450
      }
    },
    graphic: {
      graphicKey: 'map.chart.graphic',
      configOption: null,
      dataOptionId: 'num1'
    }
  },
  mapCity: {
    displayName: '城市数据',
    imageClass: 'baidu-map-city',
    region: {
      regionKey: 'explicit.region'
    },
    graphic: {
      graphicKey: 'ring.chart.graphic',
      configOption: null,
      dataOptionId: 'num1'
    }
  },
  mapCityHeat: {
    displayName: '热力地图',
    imageClass: 'baidu-map-city-heat',
    region: {
      regionKey: 'explicit.region'
    },
    graphic: {
      graphicKey: 'ring.chart.graphic',
      configOption: null,
      dataOptionId: 'num1'
    }
  },
  info6: {
    displayName: '柱状图',
    imageClass: 'baidu-chart-bar',
    region: {
      regionKey: 'explicit.region'
    },
    graphic: {
      graphicKey: 'ring.chart.graphic',
      configOption: null,
      dataOptionId: 'num1'
    }
  },
  info5: {
    displayName: '横向柱图',
    imageClass: 'baidu-chart-flip-bar',
    region: {
      regionKey: 'explicit.region'
    },
    graphic: {
      graphicKey: 'ring.chart.graphic',  // FlipBarChartGraphic
      configOption: null,
      dataOptionId: 'num1'
    }
  },
  ring: {
    displayName: '环形饼图',
    imageClass: 'baidu-chart-ring',
    region: {
      regionKey: 'explicit.region'
    },
    graphic: {
      graphicKey: 'ring.chart.graphic',
      configOption: null,
      dataOptionId: 'num1'
    }
  },
  gauge: {
    displayName: '仪表盘',
    imageClass: 'baidu-chart-dashboard',
    region: {
      regionKey: 'explicit.region'
    },
    graphic: {
      graphicKey: 'gauge.chart.graphic',
      configOption: null,
      dataOptionId: 'num1'
    }
  },
  info3: {
    displayName: '漏斗图',
    imageClass: 'baidu-chart-funnel',
    region: {
      regionKey: 'explicit.region'
    },
    graphic: {
      graphicKey: 'ring.chart.graphic',
      configOption: null,
      dataOptionId: 'num1'
    }
  },
  info4: {
    displayName: '散点图',
    imageClass: 'baidu-chart-scatter',
    region: {
      regionKey: 'explicit.region'
    },
    graphic: {
      graphicKey: 'ring.chart.graphic',
      configOption: null,
      dataOptionId: 'num1'
    }
  },
  wordCloud: {
    displayName: '词云',
    imageClass: 'baidu-chart-word-cloud',
    region: {
      regionKey: 'explicit.region'
    },
    graphic: {
      graphicKey: 'wordCloud.chart.graphic',
      configOption: null,
      dataOptionId: 'num4'
    }
  },
  dashboard: {
    displayName: 'demo',
    imageClass: 'baidu-chart-line',
    region: {
      regionKey: 'explicit.region'
    },
    graphic: {
      graphicKey: 'ring.chart.graphic',
      configOption: null,
      dataOptionId: 'num1'
    }
  }
};

export const totalGraphicMetaMap = Object.assign({}, stdGraphicMeta, customGraphicMeta);

_.keys(totalGraphicMetaMap).forEach((key) => {
  defaultGraphicMetaMap.set(key, totalGraphicMetaMap[key]);
});


export const graphicMetaMap = defaultGraphicMetaMap;