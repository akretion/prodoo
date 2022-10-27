{
    "name": "Prodoo",
    "version": "14.0.0.0.1",
    "author": "Akretion",
    "website": "www.akretion.com",
    "license": "AGPL-3",
    "category": "Generic Modules",
    "description": "Prodoo application",
    "depends": [
        "web",
        # actually depend on custom module to work but we prefer to avoid having a
        # direct dependency on a custom module
        "base",
    ],
    "installable": True,
    "application": True,
}
