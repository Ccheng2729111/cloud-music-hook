import React, { useState, useEffect } from 'react'
import Horizen from '../../baseUI/horizen-item'
import { categoryTypes, alphaTypes } from '../../api/config';
import {
    NavContainer,
    ListContainer,
    List,
    ListItem
} from "./style";
import {
    getSingerList,
    getHotSingerList,
    changeEnterLoading,
    changePageCount,
    refreshMoreSingerList,
    changePullUpLoading,
    changePullDownLoading,
    refreshMoreHotSingerList
} from './store/actionCreators';
import LazyLoad, { forceCheck } from 'react-lazyload';
import Scroll from '../../components/scroll'
import { useDispatch, useSelector } from 'react-redux'
import Loading from '../../baseUI/loading'


function Singers() {

    const [category, setCategory] = useState('')
    const [alpha, setAlpha] = useState('')

    const data = useSelector(state => ({
        singerList: state.getIn(['singers', 'singerList']),
        enterLoading: state.getIn(['singers', 'enterLoading']),
        pullDownLoading: state.getIn(['singers', 'pullDownLoading']),
        pullUpLoading: state.getIn(['singers', 'pullUpLoading']),
        pageCount: state.getIn(['singers', 'pageCount']),
    }))

    const dispatch = useDispatch()

    const { singerList, enterLoading, pullDownLoading, pullUpLoading, pageCount } = data

    useEffect(() => {
        dispatch(getHotSingerList())
    }, [dispatch])

    function updateDispatch() {
        dispatch(changePageCount(0));
        dispatch(changeEnterLoading(true));
        dispatch(getSingerList(category, alpha));
    }

    function handleUpdateAlpha(val) {
        setAlpha(val)
        updateDispatch()
    }

    function handleUpdateCatetory(val) {
        setCategory(val)
        updateDispatch()
    }

    const handlePullUp = () => {
        dispatch(changePullUpLoading(true));
        dispatch(changePageCount(pageCount + 1));
        if (category === '') {
            dispatch(refreshMoreHotSingerList());
        } else {
            dispatch(refreshMoreSingerList(category, alpha));
        }
    };

    const handlePullDown = () => {
        dispatch(changePullDownLoading(true));
        dispatch(changePageCount(0));
        if (category === '' && alpha === '') {
            dispatch(getHotSingerList());
        } else {
            dispatch(getSingerList(category, alpha));
        }
    };

    // 渲染函数，返回歌手列表
    const renderSingerList = () => {
        const list = singerList ? singerList.toJS() : [];
        return (
            <List>
                {
                    list.map((item, index) => {
                        return (
                            <ListItem key={item.accountId + "" + index}>
                                <div className="img_wrapper">
                                    <LazyLoad placeholder={<img width="100%" height="100%" src={require('./singer.png')} alt="music" />}>
                                        <img src={`${item.picUrl}?param=300x300`} width="100%" height="100%" alt="music" />
                                    </LazyLoad>
                                </div>
                                <span className="name">{item.name}</span>
                            </ListItem>
                        )
                    })
                }
            </List>
        )
    };

    return (
        <div>
            <NavContainer>
                <Horizen list={categoryTypes} title={"分类(默认热门):"} handleClick={(val) => handleUpdateCatetory(val)} oldVal={category}></Horizen>
                <Horizen list={alphaTypes} title={"首字母:"} handleClick={val => handleUpdateAlpha(val)} oldVal={alpha}></Horizen>
            </NavContainer>
            <ListContainer>
                <Scroll
                    pullUp={handlePullUp}
                    pullDown={handlePullDown}
                    pullUpLoading={pullUpLoading}
                    pullDownLoading={pullDownLoading}
                    onScroll={forceCheck}
                >
                    {renderSingerList()}
                </Scroll>
                <Loading show={enterLoading}></Loading>
            </ListContainer>
        </div>
    )
}

export default React.memo(Singers)