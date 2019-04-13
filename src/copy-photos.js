import fs from "fs";
import path from "path";
import { exec } from "child_process";

const { COPYFILE_EXCL } = fs.constants;

export const copyPhotos = (libraryPath, storagePath) => {
  const photos = getPhotos(libraryPath);
  const totalPhotosCount = photos.length;

  if (photos) {
    try {
      photos.forEach((photo, i) => {
        const pathPieces = photo.location.split("/");
        const filename = pathPieces[pathPieces.length - 1];
        const destinationPath = `${storagePath}/${filename}`;
        const timecode = photo.time.replace("-", "")
          .replace(/(\d\d)$/, (match) => { return `.${match}` });

        fs.copyFile(photo.location, destinationPath, COPYFILE_EXCL, (err) => {
          if (err) throw err;

          exec(`touch -a -m -t ${timecode} ${destinationPath}`)

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

const getPhotos = (libraryPath) => {
  const allPhotos = [];
  const masterPath = path.join(libraryPath, "/Masters")

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
            allPhotos.push({ location: photoPath, time });
          });
        });
      });
    });
  });

  return allPhotos;
};

