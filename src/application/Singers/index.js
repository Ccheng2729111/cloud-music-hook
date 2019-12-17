import React, { useEffect, useContext, useState } from 'react'
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
    refreshMoreHotSingerList,
} from './store/actionCreators';
import LazyLoad, { forceCheck } from 'react-lazyload';
import Scroll from '../../components/scroll'
import { useDispatch, useSelector } from 'react-redux'
import Loading from '../../baseUI/loading'
import { CategoryDataContext } from './data'

function Singers() {

    const { data, dispatch } = useContext(CategoryDataContext)

    const { category, alpha } = data.toJS()


    const reduxData = useSelector(state => ({
        singerList: state.getIn(['singers', 'singerList']),
        enterLoading: state.getIn(['singers', 'enterLoading']),
        pullDownLoading: state.getIn(['singers', 'pullDownLoading']),
        pullUpLoading: state.getIn(['singers', 'pullUpLoading']),
        pageCount: state.getIn(['singers', 'pageCount']),
    }))

    const reduxDispatch = useDispatch()

    const { singerList, enterLoading, pullDownLoading, pullUpLoading, pageCount } = reduxData

    useEffect(() => {
        if (!singerList.size) {
            reduxDispatch(getHotSingerList())
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        reduxDispatch(changePageCount(0));
        reduxDispatch(changeEnterLoading(true));
        reduxDispatch(getSingerList(category, alpha));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [category, alpha])

    function handleUpdateAlpha(val) {
        dispatch({
            type: 'CHANGE_ALPHA',
            data: val === alpha ? '' : val
        })
    }

    function handleUpdateCatetory(val) {
        dispatch({
            type: 'CAHNGE_CATEGORY',
            data: val === category ? '' : val
        })
    }

    const handlePullUp = () => {
        reduxDispatch(changePullUpLoading(true));
        reduxDispatch(changePageCount(pageCount + 1));
        if (category === '') {
            reduxDispatch(refreshMoreHotSingerList());
        } else {
            reduxDispatch(refreshMoreSingerList(category, alpha));
        }
    };

    const handlePullDown = () => {
        reduxDispatch(changePullDownLoading(true));
        reduxDispatch(changePageCount(0));
        if (category === '' && alpha === '') {
            reduxDispatch(getHotSingerList());
        } else {
            reduxDispatch(getSingerList(category, alpha));
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