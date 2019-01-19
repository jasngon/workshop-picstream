import React, { Component } from 'react'
import { Header, Icon, Container, Menu, Message } from 'semantic-ui-react'
/*import {
  Stitch,
  UserPasswordCredential,
  RemoteMongoClient
} from 'mongodb-stitch-browser-sdk'
import {
  AwsServiceClient,
  AwsRequest
} from 'mongodb-stitch-browser-services-aws'*/
import BSON from 'bson'

import Login from './components/Login'
import FileInput from './components/FileInput'
import Feed from './components/Feed'

import SampleData from './sample_data'

const convertImageToBSONBinaryObject = file => {
  return new Promise(resolve => {
    var fileReader = new FileReader()
    fileReader.onload = event => {
      var eventBinary = new BSON.Binary(new Uint8Array(event.target.result))
      resolve(eventBinary)
    }
    fileReader.readAsArrayBuffer(file)
  })
}

class App extends Component {
  constructor(props) {
    super(props)

    // Paste your Stitch App ID from the Stitch Admin Console here.
    this.appId = ''

    this.state = {
      isAuthed: false,
      email: '',
      entries: []
    }
  }

  componentDidMount() {
    // This is where we will initialize our Stitch Client
    /*this.client = Stitch.initializeAppClient(this.appId)
    this.mongodb = this.client.getServiceClient(
      RemoteMongoClient.factory,
      'mongodb-atlas'
    )
    this.aws = this.client.getServiceClient(AwsServiceClient.factory, 'AWS')*/
    /*const isAuthed = false //this.client.auth.isLoggedIn
    if (isAuthed) {
      this.setState({ isAuthed })
      this.getEntries()
    }*/
  }

  login = async (email, password) => {
    const entries = await this.getEntries()
    this.setState({
      isAuthed: true,
      email,
      entries
    })
  }

  logout = async () => {
    this.setState({ isAuthed: false, email: '', entries: [] })
  }

  getEntries = async () => {
    // Using Sample Data from sample_data.json
    // Replace the following with a MongoDB Query to grab all entries,
    // sorted by ts descending. This function should return a Promise.
    return new Promise(resolve => {
      resolve(SampleData)
    })
  }

  handleFileUpload = async file => {
    if (!file) {
      return
    }

    //const key = `${this.client.auth.user.id}-${file.name}`
    //const bucket = '<YOUR AWS S3 BUCKET ID>'
    //const url = `http://${bucket}.s3.amazonaws.com/${encodeURIComponent(key)}`

    const bsonFile = await convertImageToBSONBinaryObject(file)
    console.log(`Upload ${file.name} to AWS S3.`)
    console.log(`BSON Binary Object File: ${bsonFile}`)
  }

  render() {
    const { isAuthed, email, entries } = this.state
    return (
      <Container>
        <Header as="h2" icon textAlign="center">
          <Icon name="camera retro" circular />
          <Header.Content>PicStream</Header.Content>
          <Header.Subheader>
            Built using MongoDB Stitch and AWS S3
          </Header.Subheader>
        </Header>
        {isAuthed ? (
          <Container>
            <Menu stackable>
              <Menu.Item>Welcome, {email}</Menu.Item>
              <Menu.Item>
                <FileInput handleFileUpload={this.handleFileUpload} />
              </Menu.Item>
              <Menu.Item
                position="right"
                content="Logout"
                onClick={() => {
                  this.logout()
                }}
              />
            </Menu>
            {entries.length > 0 ? (
              <Feed entries={entries} />
            ) : (
              <Message color="blue" header="No Entries Found ☹️" />
            )}
          </Container>
        ) : (
          <Login loginUser={this.login} />
        )}
      </Container>
    )
  }
}

export default App