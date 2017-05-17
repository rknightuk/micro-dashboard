import React from 'react'

const Settings = ({ onUrlChange, onFavChange, url, favHidden, isValid }) => (
	<div className="settings">
      <div className="col-xs-12">
        <h1>Micro Dashboard</h1>
        <h2>A dashboard for micro-analytics</h2>
        <p>enter your <a href="https://github.com/micro-analytics/micro-analytics-cli">micro-analytics</a> url</p>
        
        <input 
          type="text" 
          onChange={(e) => onUrlChange(e.target.value)}
          value={url}
          placeholder="https://demo.micro-analytics.io"
          className={isValid ? 'settings__url url--valid' : 'settings__url url--invalid'}
        />

        {isValid && (
          <p className="settings__options">
            <label>
              hide <code>favicon.ico</code> data 
              <input 
                type="checkbox" 
                checked={favHidden}
                onChange={onFavChange}
              />
            </label>
          </p>
        )}
      </div>
    </div>
)

export default Settings
