import Images from "../models/image_model.js";
import Users from  "../models/user_model.js";

const save_image_file_service = (file, userID ,feilds) => {

    return new Promise((resolve, reject) => {
        if (!file) {
            return reject({ message: "No file provided" });
        }
        const fileType = feilds;
        const imageBuffer = file.buffer.toString("base64");
        console.log(userID);

        const image = new Images({
            ImageName:fileType,
            Image: imageBuffer,
        });
        image
            .save()
            .then((response) => {
                // resolve({ message: "Profile image saved successfully" });
                Users.updateOne({ _id: userID }, { [response.ImageName] : response._id })
                    .then(() => {
                        resolve({ message: "image updated successfully" });
                    })
                    .catch((err) => {
                        reject({ message: "Error uploading/updating image" });
                    });
            })
            .catch((err) => {
                console.log(err);
            });
    });
};

export default save_image_file_service;