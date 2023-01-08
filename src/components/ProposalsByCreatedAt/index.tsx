import { useContext, useEffect, useState } from 'react'
import { FiMessageSquare, FiShare2 } from 'react-icons/fi'
import { AiFillDislike, AiFillLike, AiOutlineDislike, AiOutlineLike } from 'react-icons/ai'
import { RiDeleteBin6Line } from 'react-icons/ri'
import moment from 'moment';
import 'moment/locale/pt-br'
//------------------------------------------------------------------------------
import styles from './styles.module.scss'
import { Comments } from '../Comments'
import api from '../../services/api'
import { InputComment } from '../InputComment'
import { SessionContext } from '../../pages/index'
//------------------------------------------------------------------------------
export function ProposalByCreatedAt({
  index, 
  proposalData,
  handleDeleteProposal,
  handleDownvote,
  handleGiphyApi,
  handleRelevance,
  handleUnClickDownvote,
  handleUnClickUpvote,
  handleUpvote,
  giphyData,
  searchword,
  setSearchword,
}) {
  
  const session: any = useContext(SessionContext)

  const [ comments, setComments ] = useState([]);
  const [ commentCounter, setCommentCounter ] = useState(5);
  const [ commentsTotal, setCommentsTotal ] = useState([]);
  const [ firstToggle, setFirstToggle ] = useState(false);
  const [ toggleComments, setToggleComments ] = useState(false);
  const [ relevance, setRelevance] = useState(false);
  const [ upvoted, setUpvoted] = useState(false);
  const [ downvoted, setDownvoted] = useState(false);

  useEffect(() => {
    handleCommentDataTotal()
    userUpvotedThisProposal()
    userDownvotedThisProposal()
    userMadeRelevantThisProposal()
  }, [])
  
  function handleToggleComments() {
    setFirstToggle(true)
    setToggleComments(!toggleComments)

    if (!firstToggle) {
      handleCommentData(commentCounter)
    }
  }

  async function handleCommentData(n) {
    const { data } = await api.get(`/comments/${proposalData.id}`, {
      params: { take: n},
    })
    setComments(data)
    handleCommentDataTotal()
    // console.log(data)
  }

  async function handleCommentDataTotal() {
    const { data } = await api.get(`/comments/total/${proposalData.id}`)
    setCommentsTotal(data)
    // console.log(data)
  }

  async function handleLikeComment(data) {
    if (session) {
      const likeResult = await api.put(`/users/connectToComments/${session.id}`, {
        id_comment: data.id
      })
      handleCommentData(commentCounter)   
    }
  }

  async function handleUnclickLikeComment(data) {
    if (session) {
      const unclickLikeResult = await api.delete(`/users/disconnectToComments/${session.id}`, {
        params: {
          id_comment: data.id
        },
      })
      handleCommentData(commentCounter) 
      
    }
  }

  function userMadeRelevantThisProposal() {
    if (session) {
      proposalData.relevance.map((u) => {
        if (u.id_user === session.id) {
          setRelevance(true)
        }
      })
    }
  }

  function userUpvotedThisProposal() {
    if (session) {
      proposalData.upvote.map((u) => {
        if (u.id_user === session.id) {
          setUpvoted(true)
        }
      })
    }
  }

  function userDownvotedThisProposal() {
    if (session) {
      proposalData.test.map((u) => {
        if (u.id_user === session.id) {
          setDownvoted(true)
        }
      })
    }
  }

  function handleMakeRelevantAction() {
    if(session) {
      handleRelevance(proposalData)
      setRelevance(true)
    }
  }

  function handleUpvoteAction() {
    if(session) {
      handleUpvote(proposalData)
      setUpvoted(true)
    }
  }

  function handleUnclickUpvoteAction(proposalData) {
    if(session) {
      handleUnClickUpvote(proposalData)
      setUpvoted(false)
    }
  }

  function handleDownvoteAction() {
    if(session) {
      handleDownvote(proposalData)
      setDownvoted(true)
    }
  }

  function handleUnclickDownvoteAction(proposalData) {
    if(session) {
      handleUnClickDownvote(proposalData)
      setDownvoted(false)
    }
  }

  function handleIncrementCommentCounter() {
    const i = commentCounter + 5
    setCommentCounter(i)
    handleCommentData(i)

  }
  // ---------------------------------------------------------------------------
  return (
    <div className={styles.div_01}>

      <div className={styles.div_02_A}>

        <div className={styles.div_03_A}>
          {/* <p className={styles.index}>{index}</p> */}
        </div>
      
        <div className={styles.div_03_B}>
      
          <div className={styles.div_04_A}>
            <p className={styles.message}>{proposalData.message}</p>          
            <div className={styles.div_05_A}>
              <p className={styles.author} style={{ 'color': 'lightslategray'}}>Postado {moment(new Date(proposalData.created_at)).locale('pt-br').fromNow()}</p>
              <p className={styles.author}> - </p>
              
              <p className={styles.author}>{proposalData.user.name}</p>          
            </div>
          </div>

      
          <div className={styles.div_04_B}>
      
            <div className={styles.div_05_B}>
              { 
                relevance ? (
                  <button 
                    className={styles.buttonVote}
                    disabled={true}
                  >
                    Votado
                  </button>
                )
                : (
                  <button 
                    className={styles.buttonVote} 
                    onClick={() => handleMakeRelevantAction()}
                  >
                    Vote Relevante
                  </button>
                )
              }
              <div className={styles.div_highlight}>
                <button 
                  className={styles.buttonIcon}
                  onClick={() => handleToggleComments()}
                >
                  <FiMessageSquare size={18}/>
                </button>
              </div>
              <p className={styles.textNumber}>{commentsTotal.length}</p>
              <div className={styles.div_highlight}>
                <button className={styles.buttonIcon}><FiShare2 size={18}/></button>
              </div>
              <p className={styles.textNumber}>{proposalData.shares}</p>
              {
                session && proposalData.id_user === session.id && proposalData.comment[0] === undefined? (
                  <div className={styles.div_highlight}>
                    <button 
                      className={styles.buttonIcon}
                      onClick={() => handleDeleteProposal(proposalData)}
                    ><RiDeleteBin6Line size={18}/></button>
                  </div>
                )
                : null
              }
            </div>
      
            <div className={styles.div_05_C}>
              <p className={styles.messageSmall}>O presidente está cumprindo?</p>
              {
                upvoted ? (
                  <div className={styles.div_highlight}>
                    <button 
                      className={styles.buttonIcon}
                      onClick={() => handleUnclickUpvoteAction(proposalData)}
                      
                    >
                      <AiFillLike size={18}/>
                    </button>
                  </div>
                  
                )
                : (
                  <>
                    {
                      downvoted ? (
                        <div className={styles.div_non_highlight}>
                          <button
                            className={styles.buttonIcon}
                            disabled={true}
                          >
                            <AiOutlineLike size={18}/>
                          </button>                  
                        </div>
                        
                      )
                      : (
                        <div className={styles.div_highlight}>
                          <button
                            className={styles.buttonIcon}
                            onClick={() => handleUpvoteAction()}
                          >
                            <AiOutlineLike size={18}/>
                          </button>                  
                        </div>
                      )
                    }
                  </>
                )
              }
              <p className={styles.textNumber}>{proposalData.upvote.length}</p>
              {
                downvoted ? (
                  <div className={styles.div_highlight}>
                    <button 
                      className={styles.buttonIcon}
                      onClick={() => handleUnclickDownvoteAction(proposalData)}
                    >
                      <AiFillDislike size={18}/>
                    </button>
                  </div>
                  
                )
                : (
                  <>
                    {
                      upvoted ? (
                        <div className={styles.div_non_highlight}>
                          <button 
                            className={styles.buttonIcon}
                            disabled={true}
                          >
                            <AiOutlineDislike size={18}/>
                          </button>                  
                        </div>
                        
                      )
                      : (
                        <div className={styles.div_highlight}>
                          <button 
                            className={styles.buttonIcon}
                            onClick={() => handleDownvoteAction()}
                          >
                            <AiOutlineDislike size={18}/>
                          </button>                  
                        </div>
                      )
                    }
                  </>
                )
              }
              <p className={styles.textNumber}>{proposalData.test.length}</p>
            </div>
          </div>
        </div>
      </div>
      {/* ------------------------------------------------------------------ */}
      <div className={styles.div_02_B}>
        { !toggleComments 
          ? (
            null
          )
          : (
            <div className={styles.div_03_C}>
              { session
                ? (
                  <InputComment
                    parent={'Proposal'}
                    parentData={proposalData}
                    handleChildData={handleCommentData}
                    childCounter={commentCounter}
                    inputPlaceholder={'Escreva um comentário'}
                    submitButtonText={'Comentar'}
                    handleGiphyApi={handleGiphyApi}
                    giphyData={giphyData}
                    searchword={searchword}
                    setSearchword={setSearchword}
                  />
                )
                : (
                  <p>Logar para comentar</p>
                )
              }
              { comments[0] 
                ? (
                  <>
                    <p className={styles.commentTitle}>Comentários:</p>
                    <div className={styles.div_04_C}>
                      { comments.map(c => (
                        <Comments
                          key={c.id}
                          commentData={c}
                          handleLikeComment={handleLikeComment}
                          handleCommentData={handleCommentData}
                          commentCounter={commentCounter}
                          handleGiphyApi={handleGiphyApi}
                          giphyData={giphyData}
                          handleUnclickLikeComment={handleUnclickLikeComment}
                          searchword={searchword}
                          setSearchword={setSearchword}
                        />  
                      ))}
                      {
                        commentCounter > comments.length 
                          ? (null)
                          : (
                            <button
                              className={styles.moreButton}
                              onClick={() => handleIncrementCommentCounter()}
                            >
                              Mostre mais comentários
                            </button>
                          )
                      }
                    </div>
                  </>
                ) 
                : null 
              }
            </div>            
          )
        }
      </div>            
    </div>
  )
}