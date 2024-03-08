function isAdmin(req, res, next) {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).send('Acceso restringido: Solo para administradores.');
    }
}

function isPremium(req, res, next) {
    if (req.user && req.user.role === 'premium') {
        next();
    } else {
        res.status(403).send('Acceso restringido: Debes ser premium.');
    }
}

export { isAdmin, isPremium };