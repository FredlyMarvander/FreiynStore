let { Product, Code, Features, User } = require('../models/index')
const bcrypt = require('bcryptjs')
const { Op, where } = require("sequelize")
const { total } = require("../helpers/helper")
const qrCode = require('qrcode');

class Controller {
    static async getProduct(req, res) {
        try {
            const { search, type, productDelete } = req.query

            let data = await Product.findAll({
                include: {
                    model: User,
                    attributes: ['email']
                },
                order: [['name', 'ASC']]
            })







            if (search) {
                data = await Product.findAll({
                    include: {
                        model: User,
                        attributes: ['email']
                    },
                    where: {
                        name: {
                            [Op.iLike]: `%${search}%`
                        }
                    }
                })
            }

            if (type) {
                data = await Product.sortType(type, User)
            }









            res.render('products', { data, productDelete })
        } catch (error) {


            res.send(error)
        }
    }

    static async renderAddProduct(req, res) {
        try {
            let { errors } = req.query
            res.render('addProduct', { errors })
        } catch (error) {
            res.send(error)
        }
    }

    static async addProductHandler(req, res) {
        try {
            let { name, price, type, stock, image } = req.body


            let dataUser = await User.findAll({
                attributes: ['id']
            })

            let data = await Product.create({
                name, price, type, stock, image, UserId: dataUser[0].id
            })
            let code;

            if (type === "Handphone") {
                code = "001"
            } else if (type === "Laptop") {
                code = "002"
            } else if (type === "PowerBank") {
                code = "003"
            } else if (type === "Earphone") {
                code = "004"
            } else if (type === "SmartWatch") {
                code = "005"
            }

            console.log(data);


            let addCode = code + '-' + (new Date().getTime())
            let dataCode = await Code.create({
                serialCode: addCode, ProductId: data.id
            })

            res.redirect('/product')

        } catch (error) {
            if (error.name === "SequelizeValidationError") {
                let errors = error.errors.map(el => {
                    return el.message
                })



                return res.render('addProduct', { errors })
            } else {
                console.log(error);

                res.send(error)
            }
        }
    }

    static async buyProduct(req, res) {
        try {
            const { id } = req.params;


            res.render('buyProduct')

        } catch (error) {
            res.send(error)
        }
    }

    static async registerForm(req, res) {
        try {
            res.render('registerForm')
        } catch (error) {
            res.send(error)
        }
    }

    static async postRegister(req, res) {
        try {
            const { email, password, role } = req.body
            await User.create({ email, password, role })
            res.redirect('/login')
        } catch (error) {
            res.send(error)
        }
    }

    static async loginForm(req, res) {
        try {
            const { error } = req.query
            res.render('loginForm', { error })
        } catch (error) {
            res.send(error)
        }
    }

    static async postLogin(req, res) {
        try {
            const { email, password } = req.body

            let data = await User.findOne({ where: { email } })



            if (data) {
                const isValidPassword = bcrypt.compareSync(password, data.password)


                if (isValidPassword) {
                    req.session.userId = data.id // set session di controller login
                    req.session.role = data.role
                    return res.redirect('/')
                } else {
                    const error = 'Invalid Username/Password'
                    return res.redirect(`/login?error=${error}`)
                }
            } else {
                const error = 'Invalid Username/Password'
                return res.redirect(`/login?error=${error}`)
            }
        } catch (error) {


            res.send(error)
        }
    }

    static getLogout(req, res) {
        req.session.destroy((err) => {
            if (err) res.send(err)
            else {
                res.redirect('/')
            }

        })
    }

    static async productDetail(req, res) {
        try {
            let { id } = req.params;
            let data = await Product.findByPk(id, {
                include: [
                    Code,
                    Features
                ]
            });
            console.log(data);

            if (!data) {
                throw new Error("Product not found");
            }
            res.render('detailProduct', { product: data });
        } catch (error) {
            if (error.message === "Product not found") {
                return res.render('detailProduct', { errors: [error.message] });
            }


            res.send(error);
        }
    }

    static async deleteProduct(req, res) {
        try {
            let { id } = req.params


            let dataProduct = await Product.findByPk(id)
            let data = await Product.destroy({
                where: {
                    id
                }
            })
            res.redirect('/product?productDelete=' + dataProduct.name)
        } catch (error) {
            res.send(error)
        }
    }

    static async renderBuyProduct(req, res) {
        try {
            let { id } = req.params
            let data = await Product.findByPk(id)
            res.render('buyProduct', { data, total })
        } catch (error) {
            res.send(error)
        }
    }

    static async qrCode(req, res) {
        try {
            let { id } = req.params

            await Product.decrement('stock', {
                by: 1, where: {
                    id: id
                }
            })

            let data = await Code.findAll({
                where: {
                    ProductId: id
                }
            })
            let url = data[0].serialCode

            const qrUrl = await qrCode.toDataURL(url);
            res.render('qrCode', { qrUrl })
        } catch (error) {
            res.send(error)
        }
    }

    static async updateProductPage(req, res) {
        try {
            const { id } = req.params;
            let product = await Product.findByPk(id);
            res.render('updateProduct', { product });
        } catch (error) {
            res.send(error);
        }
    }

    static async updateProductHandler(req, res) {
        try {
            const { id } = req.params;
            const { name, price, type, stock, image } = req.body;

            let data = await Product.update(
                { name, price, type, stock, image },
                { where: { id } }

            )

            res.redirect('/product');

        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                const errors = error.errors.map(e => e.message);
                return res.render('updateProduct', { product: req.body, errors });
            } else {
                console.log(error);

                res.send(error);
            }
        }
    }

}

module.exports = Controller