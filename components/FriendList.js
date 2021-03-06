import React, { Component } from 'react'
import FriendMsg from './FriendMsg'
import _ from 'lodash'

class FriendList extends Component {

  constructor (props) {
    super(props)
  }
  render () {
    var {msgs, currentFriendId, changeCurrentFriend, whoIam, friends, filterText} = this.props
    var filterResult = friends.filter((f) => {
      return f.name.indexOf(filterText) > -1 && f.id !== whoIam
    })
    var orderedResult = sortFriendsByMsgDate(filterResult, msgs, whoIam)
    return (
      <div>
        {
          orderedResult.map((f, index) => {
            return (
              <FriendMsg
                friend={f}
                msgs={msgs}
                latestMsg={getLatestMessage(msgs, f.id, whoIam)}
                sender={getSender(getLatestMessage(msgs, f.id, whoIam), friends, whoIam)}
                key={index}
                currentFriendId={currentFriendId}
                changeCurrentFriend={changeCurrentFriend}
                />
            )
          }
        )
      }
    </div>
  )
}
}
function sortFriendsByMsgDate(friends, msgs, whoIam) {
  var sortedFriends = _.sortBy(friends, (f) => {
    var latestMsg = getLatestMessage(msgs, f.id, whoIam)
    return latestMsg ? latestMsg.dateTime : new Date(0)
  })
  return sortedFriends.reverse()
}
function getFriendWithLatestMsg(latestMsg, f) {
  f.latestMsg = latestMsg
  return f
}
function getSender(msg, friends, whoIam) {
  var senderName
  if (!msg) return

  _.each(friends, (f) => {
    if(f.id === msg.from) {
      senderName = msg.from === whoIam ? 'Me' : f.name
    }
  })

  return senderName
}
function getLatestMessage(msgs, friendId, whoIam) {
  var relatedMsgs = _.filter(msgs, (m) => {
    return (m.from === friendId && m.to === whoIam)
      || (m.to === friendId && m.from === whoIam)
  })
  var latestMsg =  _.reduce(relatedMsgs, (m1, m2) => {
    return m1.dateTime > m2.dateTime ? m1 : m2
  })
  return latestMsg
}
export default FriendList
