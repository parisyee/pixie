import React, { Component } from 'react';
import { remote } from 'electron';
import storage from 'electron-json-storage';
import { copyPhotos } from './copy-photos';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    
    this.selectPhotoLibraryPath = this.selectPhotoLibraryPath.bind(this);
    this.selectStoragePath = this.selectStoragePath.bind(this);
    this.copyPhotos = this.copyPhotos.bind(this);
  }

  componentDidMount() {
    storage.getMany(['libraryPath', 'storagePath'], (error, data) => {
      if (error) throw error;
      this.setState({
        libraryPath: data.libraryPath.value,
        storagePath: data.storagePath.value
      });
    });
  }

  selectPhotoLibraryPath() {
    let options = {properties: ['openFile']};

    remote.dialog.showOpenDialog(options, (filepaths) => {
      if (filepaths && filepaths.length === 1) {
        let filepath = filepaths[0];

        storage.set('libraryPath', { value: filepath }, (error) => {
          if (error) throw error;
          this.setState({libraryPath: filepath});
        });
      }
    });
  }

  selectStoragePath() {
    let options = {properties: ['openDirectory', 'createDirectory']};

    remote.dialog.showOpenDialog(options, (filepaths) => {
      if (filepaths && filepaths.length === 1) {
        let filepath = filepaths[0];

        storage.set('storagePath', { value: filepath }, (error) => {
          if (error) throw error;
          this.setState({storagePath: filepath});
        });
      }
    });

  }

  copyPhotos() {
    copyPhotos(this.state.libraryPath, this.state.storagePath);
  }

  render() {
    return (
      <div>
        <div>
          <h4>Photo Library Path</h4>
          <p>
            {this.state.libraryPath}
          </p>
          <div>
            <button onClick={this.selectPhotoLibraryPath}>
              Select Photo Library Path
            </button>
          </div>
        </div>
        <div>
          <h4>Storage Path</h4>
          <p>
            {this.state.storagePath}
          </p>
          <div>
            <button onClick={this.selectStoragePath}>
              Select Storage Path
            </button>
          </div>
        </div>
        <div>
          <button onClick={this.copyPhotos}>
            Copy Photos
          </button>
        </div>
      </div>
    );
  }
}

export default App;
