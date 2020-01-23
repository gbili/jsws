import React, { Component } from "react";
import { ToastContainer } from 'react-toastify';
import http from './services/httpService';
import config from './config.json'

import "./App.css";
import 'react-toastify/dist/ReactToastify.css';

class App extends Component {

  state = {
    posts: []
  };

  constructor(props) {
    super(props);

    this.handleAdd = this.handleAdd.bind(this);
    this.handleOptimisticUpdate = this.handleOptimisticUpdate.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  async componentDidMount() {
    // promises to hold the result of an asynchronous request
    const promise = http.get(config.apiEndpoint);
    const { data:posts } = await promise;
    this.setState({posts});
  }

  async handleAdd() {
    const obj = {title: 'a', body: 'b'};
    const { data: post } = await http.post(config.apiEndpoint, obj);
    const posts = [post, ...this.state.posts];
    this.setState({posts});
  };

  async handleOptimisticUpdate(post) {
    const postsOld = this.state.posts;
    const index = this.state.posts.indexOf(post);

    const newVersionOfPost = {...post};
    newVersionOfPost.title = 'optimistic update'

    const updatedPosts = [...this.state.posts];
    updatedPosts[index] = newVersionOfPost;

    this.setState({ posts:updatedPosts })

    try {
      await http.put(config.apiEndpoint + `/${post.id}`, post);
    } catch (exception) {
      this.setState({posts:postsOld})
    }
  }

  async handleDelete(post) {
    const postsOld = this.state.posts;
    const posts = this.state.posts.filter(p => p.id !== post.id);
    this.setState({posts});
    try {
      await http.delete(config.apiEndpoint + `/000${post.id}`);
    } catch (exception) {
      this.setState({posts: postsOld});
    }
  };

  render() {
    return (
      <React.Fragment>
        <ToastContainer />
        <button className="btn btn-primary" onClick={this.handleAdd}>
          Add
        </button>
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {this.state.posts.map(post => (
              <tr key={post.id}>
                <td>{post.title}</td>
                <td>
                  <button
                    className="btn btn-info btn-sm"
                    onClick={() => this.handleOptimisticUpdate(post)}
                  >
                    Update
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => this.handleDelete(post)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </React.Fragment>
    );
  }
}

export default App;
