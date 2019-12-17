import * as actionTypes from './constants'
import { fromJS } from 'immutable'
import { getBannerRequest, getRecommendListRequest } from '../../../api/request'

//异步处理 在action中处理请求副作用


//改变bannerlist fn 返回type和data
export const changeBannerList = (data) => ({
    type: actionTypes.CHANE_BANNER,
    data: fromJS(data)
})

export const changeRecommendList = (data) => ({
    type: actionTypes.CHANGE_RECOMMEND_LIST,
    data: fromJS(data)
})

export const changeEnterLoading = (data) => ({
    type: actionTypes.CHANGE_ENTER_LOADING,
    data
})

//获取banner的获取接口数据
export const getBannerList = () => {
    return (dispatch) => {
        getBannerRequest().then(data => {
            dispatch(changeBannerList(data.banners))
        }).catch(() => {
            console.log('err on banners')
        })
    }
}

export const getRecommendList = () => {
    return (dispatch) => {
        getRecommendListRequest().then(data => {
            dispatch(changeRecommendList(data.result))
            dispatch(changeEnterLoading(false))
        }).catch(() => {
            console.log('err on list')
        })
    }
}