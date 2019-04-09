import fs from 'fs';
import path from 'path';

const { COPYFILE_EXCL } = fs.constants;

const getPhotoPaths = (libraryPath) => {
  const allPhotos = [];
  const masterPath = path.join(libraryPath, '/Masters')

  try {
    fs.existsSync(masterPath);
  } catch (e) {
    alert(`Error: could not read path: ${masterPath}`);

    return;
  }
  
  const years = fs.readdirSync(masterPath);

  years.forEach((year) => {
    const yearPath = path.join(masterPath, year);
    const months = fs.readdirSync(yearPath);
    
    months.forEach((month) => {
      const monthPath = path.join(yearPath, month);
      const days = fs.readdirSync(monthPath);

      days.forEach((day) => {
        const dayPath = path.join(monthPath, day);
        const times = fs.readdirSync(dayPath);

        times.forEach((time) => {
          const timePath = path.join(dayPath, time);
          const photos = fs.readdirSync(timePath);

          photos.forEach((photo) => {
            const photoPath = path.join(timePath, photo);

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
  const photoPaths = getPhotoPaths(libraryPath);
  const totalPhotosCount = photoPaths.length;

  if (photoPaths) {
    try {
      photoPaths.forEach((photoPath, i) => {
        const pathPieces = photoPath.split('/');
        const filename = pathPieces[pathPieces.length - 1];
        const destinationPath = `${storagePath}/${filename}`;

        fs.copyFile(photoPath, destinationPath, COPYFILE_EXCL, (err) => {
          if (err) throw err;

          console.log(
            `Copied file ${i} of ${totalPhotosCount} - ${filename} from ${libraryPath} to ${storagePath}.`
          );
        });
      });
    } catch (e) {
      alert(`Error: Could not copy files from ${libraryPath} to ${storagePath}`);
    }
  } else {
    return;
  }
};

export default copyPhotos;
