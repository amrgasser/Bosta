const getIdFromHeader = (auth) => {
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    return decoded.borrower.id;
}

export default getIdFromHeader