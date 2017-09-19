import fs from 'fs';
import path from 'path';
import moment from 'moment'

const { COPYFILE_EXCL } = fs.constants;

const getPhotoPaths = (libraryPath) => {
  const allPhotos = [];
  let masterPath = path.join(libraryPath, '/Masters')

  let years = fs.readdirSync(masterPath);
  
  years.forEach((year) => {
    let yearPath = path.join(masterPath, year);
    let months = fs.readdirSync(yearPath);
    
    months.forEach((month) => {
      let monthPath = path.join(yearPath, month);
      let days = fs.readdirSync(monthPath);

      days.forEach((day) => {
        let dayPath = path.join(monthPath, day);
        let times = fs.readdirSync(dayPath);

        times.forEach((time) => {
          let timePath = path.join(dayPath, time);
          let photos = fs.readdirSync(timePath);

          photos.forEach((photo) => {
            let photoPath = path.join(timePath, photo);

            // burst photos will be a directory at this point...
            allPhotos.push(photoPath);
          })
        })
      })
    })
  })

  return allPhotos;
};

const copyPhotos = (libraryPath, storagePath) => {
  let photoPaths = getPhotoPaths(libraryPath);
  photoPaths.forEach((photoPath) => {

    let stats = fs.statSync(photoPath);
    let date = stats.birthtime;
    let pathPieces = photoPath.split('/');
    let filename = pathPieces[pathPieces.length - 1];
    let filenamePieces = filename.split('.');

    let destinationPath = `${storagePath}/${filenamePieces[0]}_${moment(date).format('YYYY_MM_DD_HH_mm_ss')}.${filenamePieces[1]}`;
    debugger;
  })
}

// fs.copyFile('source.txt', 'destination.txt', (err) => {
//   if (err) throw err;
//   console.log('source.txt was copied to destination.txt');
// });

export default copyPhotos;
