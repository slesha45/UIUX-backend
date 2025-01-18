const router = require("express").Router();
const userController = require("../controllers/userControllers")

router.post("/create", userController.createUser)
router.post("/login", userController.loginUser)
router.get('/profile',userController.getUserProfile)
router.put('/profile',userController.updateUserProfile)
router.get("/profile/get", userController.getCurrentProfile);
router.get("/all", userController.getAllUsers);

module.exports = router