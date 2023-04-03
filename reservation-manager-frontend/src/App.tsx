import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {





  return (
    <nav className="navbar navbar-inverse navbar-fixed-top">
        <div className="container">
            <div className="navbar-header">
                <button type="button" className="navbar-toggle collapsed" data-toggle="collapse"
                        data-target="#navbar"
                        aria-expanded="false" aria-controls="navbar">
                    <span className="sr-only">Toggle navigation</span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                </button>
                <span className="navbar-brand">Webshop</span>
            </div>
            <div id="navbar" className="navbar-collapse collapse">
                <ul className="nav navbar-nav">
                    <li data-state="shop" ><a><span className="glyphicon glyphicon-th"></span></a></li>
                    <li data-state="cart" ><a><span className="glyphicon glyphicon-shopping-cart"></span></a></li>
                    <li data-state="chat" ><a><span className="glyphicon glyphicon-comment"></span></a></li>
                </ul>
            </div>
        </div>
    </nav>
    /*<div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>*/
  );
}

export default App;
