const router = require("express").Router();
const {authGuard} = require("../middleware/authGuard")
const packageController = require("../controllers/packageControllers")

router.post('/create', packageController.createPackage)
router.get('/get_all_package', packageController.getAllPackages)
router.get('/get_single_package/:id', packageController.getSinglePackage)
router.delete('/delete_package/:id', packageController.deletePackage)

module.exports = router