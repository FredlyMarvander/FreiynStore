let { Product, Code, Features, User } = require('../models/index')
const bcrypt = require('bcryptjs')
const { Op } = require("sequelize")

class Controller {
    static async getProduct(req, res) {
        try {
            const { search, type, productDelete } = req.query

            let data = await Product.findAll({
                include: {
                    model: User,
                    attributes: ['email']
                }
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
                attributes: ['email']
            })

            let data = await Product.create({
                name, price, type, stock, image, UserId: dataUser[0].email
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
            } else if (type === "Smartwatch") {
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
                include: [Code]
            });
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
            console.log(error);

            res.send(error)
        }
    }

}

module.exports = Controller