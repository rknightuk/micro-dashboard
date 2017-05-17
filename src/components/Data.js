import React from 'react'

const Data = ({ data, time, filter, hideFav, onFilterChange }) => (
  <div>
    <p>Updated: {time.toString()}</p>

    <div>
      <div className="data__row data__row--header">
        <div className="data__row--name" onClick={() => onFilterChange('name')}>
          Page {filter === 'name' ? '*' : ''}
        </div>
        <div className="data__row--count" onClick={() => onFilterChange('views')}>
          {filter === 'views' ? '*' : ''} Views
        </div>
      </div>
      {data.filter(d => {
          if (hideFav) return d.name !== '/favicon.ico'
          return d
      }).map((d, i) => (
        <div className="data__row" key={i}>
          <div className="data__row--name">
            {d.name}
          </div>
          <div className="data__row--count">
            {d.views.length}
          </div>
        </div>
      ))}
    </div>
  </div>
)

export default Data
