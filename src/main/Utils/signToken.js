import jwt from 'jsonwebtoken'


const signToken = (borrower) => {
    const token = jwt.sign(
        {
            borrower: {
                id: borrower.id,
                email: borrower.email
            }
        },
        process.env.TOKEN_SECRET
    );
    return token
}

export default signToken
