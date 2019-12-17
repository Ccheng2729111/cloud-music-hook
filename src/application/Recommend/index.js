import React, { useEffect } from 'react'
import Slider from '../../components/slider'
import RecommendList from '../../components/list'
import Scroll from '../../components/scroll'
import { Content } from './style'
import { useDispatch, useSelector } from 'react-redux'
import * as actionTypes from './store/actionCreators'
import { forceCheck } from 'react-lazyload'
import Loading from '../../baseUI/loading'

function Recommend(props) {

    //用redux新特性 useSelector useDispatch来实现
    const data = useSelector(state => {
        return {
            bannerList: state.getIn(['recommend', 'bannerList']),
            recommendList: state.getIn(['recommend', 'recommendList']),
            enterLoading: state.getIn(['recommend', 'enterLoading']),
        }
    })

    const dispatch = useDispatch()

    const { bannerList, recommendList, enterLoading } = data;

    // const { getBannerDataDispatch, getRecommendListDataDispatch } = props

    useEffect(() => {
        if (!bannerList.size) {
            dispatch(actionTypes.getBannerList());
        }

        if (!recommendList.size) {
            dispatch(actionTypes.getRecommendList());
        }
    }, [bannerList.size, dispatch, recommendList])

    const bannerListJS = bannerList ? bannerList.toJS() : []
    const recommendListJS = recommendList ? recommendList.toJS() : []

    return (
        <Content>
            <Scroll onScroll={forceCheck} >
                {enterLoading ? <Loading /> : null}
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