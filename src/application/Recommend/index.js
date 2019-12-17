import React, { useEffect } from 'react'
import Slider from '../../components/slider'
import RecommendList from '../../components/list'
import Scroll from '../../components/scroll'
import { Content } from './style'
import { useDispatch, useSelector } from 'react-redux'
import * as actionTypes from './store/actionCreators'

function Recommend(props) {

    //用redux新特性 useSelector useDispatch来实现
    const data = useSelector(state => ({
        bannerList: state.getIn(['recommend', 'bannerList']),
        recommendList: state.getIn(['recommend', 'recommendList'])
    }))

    const dispatch = useDispatch()

    const { bannerList, recommendList } = data;

    // const { getBannerDataDispatch, getRecommendListDataDispatch } = props

    useEffect(() => {
        dispatch(actionTypes.getBannerList());
        dispatch(actionTypes.getRecommendList());
    }, [dispatch])

    const bannerListJS = bannerList ? bannerList.toJS() : []
    const recommendListJS = recommendList ? recommendList.toJS() : []

    return (
        <Content>
            <Scroll>
                <div>
                    <Slider bannerList={bannerListJS} />
                    <RecommendList recommendList={recommendListJS} />
                </div>
            </Scroll>
        </Content>
    )
}

// const mapStateToProps = (state) => ({
//     bannerList: state.getIn(['recommend', 'bannerList']),
//     recommendList: state.getIn(['recommend', 'recommendList'])
// })

// const mapDispatchToProps = (dispatch) => {
//     return {
//         getBannerDataDispatch() {
//             dispatch(actionTypes.getBannerList())
//         },
//         getRecommendListDataDispatch() {
//             dispatch(actionTypes.getRecommendList())
//         }
//     }
// }

export default React.memo(Recommend)