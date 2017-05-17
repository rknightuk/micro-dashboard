import React, { Component } from 'react'
import validUrl from 'check-valid-url'

import Settings from './components/Settings'
import Data from './components/Data'

import _ from 'lodash'

const PREFIX = 'mad-'
const URL_KEY = `${PREFIX}url`
const FAVICON_KEY = `${PREFIX}fav`

class App extends Component {

  state = {
    url: '',
    hideFav: false,
    isValid: false,
    data: null,
    time: null,
    error: null,
    filter: 'views',
    loading: false,
  }

  componentDidMount() {
    this.fetchFromStorage()
  }

  fetchFromStorage = () => {
    const url = localStorage.getItem(URL_KEY)
    const hideFav = localStorage.getItem(FAVICON_KEY)

    this.setState({
      url,
      hideFav: hideFav === 'true',
      isValid: validUrl.isUrl(url)
    }, () => this.fetchData())
  }

  render() {

    let buttonText = this.state.data ? 'Refresh' : 'Fetch'
    if (this.state.loading) buttonText = 'Loading...'

    const {
      url,
      hideFav,
      isValid,
      loading,
      error,
      data,
      time,
      filter
    } = this.state

    return (
      <div>
        <Settings 
          onUrlChange={this.handleUrlChange}
          onFavChange={this.toggleFavChange}
          url={url}
          favHidden={hideFav}
          isValid={isValid}
        />

        <div className="content-wrapper">
          <div className="info">
            {! isValid && (
              <p>Enter your micro-analytics url above to load your data</p>
            )}
            {isValid && (
              <p>
                <button onClick={this.fetchData} disabled={loading}>
                  {buttonText}
                </button>
              </p>
            )}
            {error && (
              <p>{error}</p>
            )}
          </div>

          {data && isValid && (
            <Data 
              data={data}
              time={time}
              filter={filter}
              onFilterChange={this.handleFilterChange}
              hideFav={hideFav}
            />
          )}

          <footer>
            Made by <a href="https://robblewis.me">Robb Lewis</a>{' / '}
            <a href="https://twitter.com/rmlewisuk">@rmlewisuk</a>
          </footer>
        </div>
      </div>
    )
  }

  handleUrlChange = (url) => {
    const isValid = !! validUrl.isUrl(url)

    this.setState({ 
      url,
      isValid,
      error: null,
    })

    localStorage.setItem(URL_KEY, url)
  }

  toggleFavChange = () => {
    this.setState(s => ({
      hideFav: !s.hideFav
    }), () => {
      localStorage.setItem(FAVICON_KEY, this.state.hideFav)
    })
  }

  fetchData = () => {
    if (! this.state.isValid || ! this.state.url) return

    this.setState({ loading: true })

    fetch(`${this.state.url}?all=true`)
    .then(response => response.json())
    .then(json => {
      this.setState({
        data: this.formatData(json.data),
        time: new Date(json.time),
        loading: false,
      })
    })
    .catch(err => {
      this.setState({ error: `Something went wrong "${err.message}". Please check your micro-analytics url and try again` })
    })
  }

  formatData = (data) => {
    return this.sortData(Object.keys(data).map((key) => {
      const newData = data[key]
      newData.name = key
      return newData
    }))
  }

  handleFilterChange = (filter) => {
    const reverse = filter === this.state.filter
    const stateData = this.state.data
    let data

    if (reverse) {
      data = _.reverse(stateData)
    } else {
      data = filter === 'views' ? this.sortByViews(stateData) : this.sortByName(stateData)
    }

    this.setState({
      filter,
      data,
    })
  }

  sortData = (data) => {
    if (this.state.filter === 'views') {
      return this.sortByViews(data)
    } else {
      return this.sortByName(data)
    }
  }

  sortByName = (data) => {
    return _.sortBy(data, (p) => p.name)
  }

  sortByViews = (data) => {
    return _.reverse(_.sortBy(data, (p) => p.views.length))
  }
}

export default App
