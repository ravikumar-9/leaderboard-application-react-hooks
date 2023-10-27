import {useState, useEffect} from 'react'

import Loader from 'react-loader-spinner'

import {
  LeaderboardContainer,
  LoadingViewContainer,
  ErrorMessage,
} from './styledComponents'

import LeaderboardTable from '../LeaderboardTable'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const Leaderboard = () => {
  // Your code goes here...

  const [apiStatus, setApiResponse] = useState({
    status: apiStatusConstants.initial,
    data: null,
    errorMsg: null,
  })

  useEffect(() => {
    const getApiResponse = async () => {
      const url = 'https://apis.ccbp.in/leaderboard'
      const options = {
        method: 'GET',
        headers: {
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJhaHVsIiwicm9sZSI6IlBSSU1FX1VTRVIiLCJpYXQiOjE2MjMwNjU1MzJ9.D13s5wN3Oh59aa_qtXMo3Ec4wojOx0EZh8Xr5C5sRkU',
        },
      }

      setApiResponse(prev => ({...prev, status: apiStatusConstants.inProgress}))
      const response = await fetch(url, options)
      const responseData = await response.json()

      console.log(responseData.leaderboard_data)
      console.log(responseData)
      if (response.ok === true) {
        const updatedResponse = responseData.leaderboard_data.map(each => ({
          id: each.id,
          language: each.language,
          name: each.name,
          profileImgUrl: each.profile_image_url,
          rank: each.rank,
          score: each.score,
          timeSpent: each.time_spent,
        }))
        setApiResponse(prev => ({
          ...prev,
          data: updatedResponse,
          status: apiStatusConstants.success,
        }))
      } else {
        setApiResponse(prev => ({
          ...prev,
          status: apiStatusConstants.failure,
          errorMsg: responseData.error_msg,
        }))
      }
    }

    getApiResponse()
  }, [])

  const renderLoaderView = () => (
    <LoadingViewContainer>
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </LoadingViewContainer>
  )

  const renderSuccessView = () => {
    const {data} = apiStatus
    return <LeaderboardTable leaderboardData={data} />
  }

  const renderFailureView = () => {
    const {errorMsg} = apiStatus

    return <ErrorMessage>{errorMsg}</ErrorMessage>
  }

  const renderLeaderboard = () => {
    const {status} = apiStatus
    switch (status) {
      case apiStatusConstants.inProgress:
        return renderLoaderView()
      case apiStatusConstants.success:
        return renderSuccessView()

      case apiStatusConstants.failure:
        return renderFailureView()

      default:
        return null
    }
    // Your code goes here...
  }

  return <LeaderboardContainer>{renderLeaderboard()}</LeaderboardContainer>
}

export default Leaderboard
