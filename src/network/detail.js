import { request } from "./request";

// 根据iid获取向服务器请求详情页数据
export function getDetail(iid) {
  return request({
    url: "/detail",
    params: {
      iid
    }
  });
}

// 获取商品推荐
export function getRecommend() {
  return request({
    url: "/recommend"
  });
}
// 将从服务器请求过来的数据表 封装到类中 通过创建这个类的对象,来传递到组件里面
export class Goods {
  constructor(itemInfo, columns, services) {
    this.title = itemInfo.title;
    this.desc = itemInfo.desc;
    this.newPrice = itemInfo.price;
    this.oldPrice = itemInfo.oldPrice;
    this.discount = itemInfo.discountDesc;
    this.columns = columns;
    this.services = services;
    this.realPrice = itemInfo.lowNowPrice;
  }
}

export class Shop {
  constructor(shopInfo) {
    this.logo = shopInfo.shopLogo;
    this.name = shopInfo.name;
    this.fans = shopInfo.cFans;
    this.sells = shopInfo.cSells;
    this.score = shopInfo.score;
    this.goodsCount = shopInfo.cGoods;
  }
}

export class GoodsParam {
  constructor(info, rule) {
    // 注: images可能没有值(某些商品有值, 某些没有值)
    this.image = info.images ? info.images[0] : "";
    this.infos = info.set;
    this.sizes = rule.tables;
  }
}
