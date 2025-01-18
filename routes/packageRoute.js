const router = require("express").Router();
const {authGuard} = require("../middleware/authGuard")
const packageController = require("../controllers/packageControllers")

router.post('/create', packageController.createPackage)
router.get('/get_all_package', authGuard, packageController.getAllPackages)
router.get('/get_single_package/:id', authGuard, packageController.getSinglePackage)
router.delete('/delete_package/:id', authGuard, packageController.deletePackage)

module.exports = router