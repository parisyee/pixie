import fs from 'fs';
import exifParser from 'exif-parser';
import path from 'path';

const { COPYFILE_EXCL } = fs.constants;

export default (libraryPath, storagePath) => {
  let masterPath = path.join(libraryPath, '/Masters')
  // let years = [];
  // let months = [];
  // let days = [];
  // let times = [];
  const allPhotos = [];

  fs.readdir(masterPath, 'utf-8', (err, years) => {
    if (err) throw err;
  
    years.forEach((year) => {
      let yearPath = path.join(masterPath, year);
      fs.readdir(yearPath, 'utf-8', (err, months) => {
        if (err) throw err;
          
        months.forEach((month) => {
          let monthPath = path.join(yearPath, month);
          fs.readdir(monthPath, 'utf-8', (err, days) => {
            if (err) throw err;

            days.forEach((day) => {
              let dayPath = path.join(monthPath, day);
              fs.readdir(dayPath, 'utf-8', (err, times) => {
                if (err) throw err;

                times.forEach((time) => {
                  let timePath = path.join(dayPath, time);
                  fs.readdir(timePath, 'utf-8', (err, photos) => {
                    if (err) throw err;

                    photos.forEach((photo) => {
                      let photoPath = path.join(timePath, photo);
                      allPhotos.push(photoPath);
                    })
                  })
                })
              })
            })
          })
        })
      })
    })
  })

// fs.copyFile('source.txt', 'destination.txt', (err) => {
//   if (err) throw err;
  //   console.log('source.txt was copied to destination.txt');
  // });
  console.log(allPhotos);
};
