import request from '@/utils/request'

// 获取spu列表数据接口 /admin/product/{page}/{limit} get
export const reqSpuList=(page,limit,category3Id)=>{
    return request({
        url:`/admin/product/${page}/${limit}`,
        method:'get',
        params:{
            category3Id
        }
    })
}

// 获取spu信息 /admin/product/getSpuById/{spuId} get
export const reqSpu=(spuId)=>{
    return request({
        url:`/admin/product/getSpuById/${spuId}`,
        method:'get'
    })
}

// 获取品牌信息 /admin/product/baseTrademark/getTrademarkList
export const reqTradeMarkList=()=>{
    return request({
        url:'/admin/product/baseTrademark/getTrademarkList',
        method:'get'
    })
}

// 获取spu图片的接口 /admin/product/spuImageList/{spuId} get
export const reqSpuImageList=(spuId)=>{
    return request({
        url:`/admin/product/spuImageList/${spuId}`,
        method:'get'
    })
}

// 获取平台全部销售属性---整个平台销售属性一共三个  /admin/product/baseSaleAttrList get
export const reqBaseSaleAttrList=()=>{
    return request({
        url:'/admin/product/baseSaleAttrList',
        method:'get'
    })
}

// 修改或添加spu信息的接口
export const reqAddOrUpdateSpu=(spuInfo)=>{
    if(spuInfo.id){
        return request({
            url:'/admin/product/updateSpuInfo',
            method:'post',
            data:spuInfo
        })
    }else{
        return request({
            url:'/admin/product/saveSpuInfo',
            method:'post',
            data:spuInfo
        })
    }
}

// 删除某个spu的接口  /admin/product/deleteSpu/{spuId}
export const reqDeleteSpu=(spuId)=>{
    return request({
        url:`/admin/product/deleteSpu/${spuId}`,
        method:'delete'
    })
}