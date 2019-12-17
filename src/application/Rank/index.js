import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getRankList } from './store'
import { filterIndex } from '../../api/utils'
import { renderRoutes } from 'react-router-config'
import {
  List,
  ListItem,
  SongList,
  Container
} from './style';
import Scroll from '../../components/scroll'
import EnterLoading from '../../baseUI/loading'
import Loading from '../../baseUI/loading-v2'

function Rank(props) {

  const data = useSelector(state => {
    return {
      list: state.getIn(['rank', 'rankList']),
      loading: state.getIn(['rank', ' loading']),
    }
  })

  const { list, loading } = data

  let rankList = list ? list.toJS() : [];

  const dispatch = useDispatch()

  useEffect(() => {
    if (!rankList.length) {
      dispatch(getRankList())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  let globalStartIndex = filterIndex(rankList);
  let officialList = rankList.slice(0, globalStartIndex);
  let globalList = rankList.slice(globalStartIndex);


  function enterDetail() {

  }

  const renderSongList = (list) => {
    return list.length ? (
      <SongList>
        {
          list.map((item, index) => {
            return <li key={index}>{index + 1}. {item.first} - {item.second}</li>
          })
        }
      </SongList>
    ) : null;
  }
  const renderRankList = (list, global) => {
    return (
      <List globalRank={global}>
        {
          list.map((item, index) => {
            return (
              <ListItem key={index} tracks={item.tracks} onClick={() => enterDetail(item.name)}>
                <div className="img_wrapper">
                  <img src={item.coverImgUrl} alt="" />
                  <div className="decorate"></div>
                  <span className="update_frequecy">{item.updateFrequency}</span>
                </div>
                {renderSongList(item.tracks)}
              </ListItem>
            )
          })
        }
      </List>
    )
  }

  // 榜单数据未加载出来之前都给隐藏
  let displayStyle = loading ? { "display": "none" } : { "display": "" };

  return (
    <Container>
      <Scroll>
        <div>
          <h1 className="offical" style={displayStyle}>官方榜</h1>
          {renderRankList(officialList)}
          <h1 className="global" style={displayStyle}>全球榜</h1>
          {renderRankList(globalList, true)}
          {loading ? <EnterLoading><Loading></Loading></EnterLoading> : null}
        </div>
      </Scroll>
      {renderRoutes(props.route.routes)}
    </Container>
  )
}

export default React.memo(Rank)