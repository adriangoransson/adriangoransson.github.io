DEPENDENCIES="wrapfig paratype"

sudo -v

for DEPENDENCY in $DEPENDENCIES; do
    echo "Installing $DEPENDENCY"
    sudo tlmgr install "$DEPENDENCY"
done
