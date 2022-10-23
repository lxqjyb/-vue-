import request from "@/utils/request"

// 获取图片数据  /admin/product/spuImageList/{spuId} get
export const reqSpuImageList=(spuId)=>{
    return request({
        url:`/admin/product/spuImageList/${spuId}`,
        method:'get'
    })
}

// 获取销售属性的数据  /admin/product/spuSaleAttrList/{spuId} get
export const reqSpuSaleAttrList=(spuId)=>{
    return request({
        url:`/admin/product/spuSaleAttrList/${spuId}`,
        method:'get'
    })
}

// 获取平台属性的数据 /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}  get
export const reqAttrInfoList=(category1Id,category2Id,category3Id)=>{
    return request({
        url:`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
        method:'get'
    })
}

// 添加sku接口 /admin/product/saveSkuInfo
export const reqAddSku=(skuInfo)=>{
    return request({
        url:'/admin/product/saveSkuInfo',
        method:'post',
        data:skuInfo
    })
}

// 获取某个spu的sku列表接口 /admin/product/findBySpuId/{spuId}
export const reqSkuList=(spuId)=>{
    return request({
        url:`/admin/product/findBySpuId/${spuId}`,
        method:'get'
    })
}


// 获取sku管理模块的sku列表接口 /admin/product/list/{page}/{limit}
export const reqSku=(page,limit)=>{
    return request({
        url:`/admin/product/list/${page}/${limit}`,
        method:'get'
    })
}

// 请求sku下架的接口 /admin/product/cancelSale/{skuId}
export const reqCancelSale=(skuId)=>{
    return request({
        url:`/admin/product/cancelSale/${skuId}`,
        method:'get'
    })
}

// 请求sku上架的接口 /admin/product/onSale/{skuId}
export const reqOnSale=(skuId)=>{
    return request({
        url:`/admin/product/onSale/${skuId}`,
        method:'get'
    })
}

// 请求某个sku的详情信息 /admin/product/getSkuById/{skuId} get
export const reqSkuInfo=(skuId)=>{
    return request({
        url:`/admin/product/getSkuById/${skuId}`,
        method:'get'
    })
}

// 删除某个sku接口  /admin/product/deleteSku/{skuId} 
export const reqDeleteSku=(skuId)=>{
    return request({
        url:`/admin/product/deleteSku/${skuId}`,
        method:'delete'
    })
}