import './style/main.scss';

import React from 'react';
import ReactDom from 'react-dom';
import superagent from 'superagent';

const API_URL = 'http://www.reddit.com/r';
/*
 *App  --manage application state
 *  SearchForm -- collect user input and call a handleSearch function
 *  SearchResultsList -- display reddit results/articles
*/

//conditional rendering function that takes a truthy test and renders if true, else return undefined
let renderIf = (test, component) => test ? component : undefined;

class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

//handle view state
  handleChange(e) {
    this.setState({
      searchText: e.target.value,
    })
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.handleSearch(this.state.searchText);
  }

  render () {
    return (
      <form onSubmit={this.handleSubmit}>
        <label> {this.props.title} </label>
        <input
          type='text'
          onChange={ this.handleChange }
          value={ this.state.searchText }
        />
        <button type='submit'> search boardNames </button>
      </form>
    )
  }
}


//display revieve an array of reddit articles through props
//and print to screen
class SearchResultsList extends React.Component {
  constructor(props) {
    super(props);
  }
  render () {
    return (
      <ul>
        { this.props.articles.map((item, i) =>
          <li key={i}>
            <a href={item.data.url}> { item.data.title } </a>
          </li>
        ) }
      </ul>
    )
  }
}


//render () {

//this input isnt an attribute. it is a property inside of the constructor for that react component with the key/value pairing of
//name : cool
//  <input name="cool" />
// }

//we could then access this key/value pairing of name: cool
//inside of a child component through props


//App's job is to hold all application state
class App extends React.Component {
  constructor (props) {
    //super takes props as an argument(passed down from parent component) and allows us to use this.props in our component instance later on - ie - TEMPLATING IN OUR RENDERING FUNCTION.
    //super acts like the "new" keyword and binds our props to "this"
    super (props);
    this.state = {
      results: null,
      searchErrorMessage: null,
    }
    //bind the method to the constructor for use
    this.redditBoardFetch = this.redditBoardFetch.bind(this);
  }
  //update state whenever state is changed
  componentDidUpdate () {
    console.log('::::::STATE:::::::', this.state);
  }


  redditBoardFetch (board) {
    superagent.get(`${API_URL}/${board}.json`)
      .then(res => {
        console.log('response success', res);
        this.setState({
        results: res.body.data.children,
        searchErrorMessage: null,
      });
      })
      .catch(err => {
        console.error(err);
        this.setState({
          results: null,
          searchErrorMessage: `unable to find the reddit board ${board}`
        });
      })
  }

  render () {
    return (
      <main>
        <h1> cool beans </h1>
        <SearchForm title='reddit board' handleSearch={ this.redditBoardFetch }
        />
        {renderIf(this.state.results, <SearchResultsList articles={ this.state.results || [] } /> )}
        {renderIf(this.state.searchErrorMessage,
          <p> { this.state.searchErrorMessage } </p> )}
      </main>
    );
  }
}

ReactDom.render(<App />, document.getElementById('root'));
