from google.cloud import datastore
from User import User
import config

# Look at: https://console.cloud.google.com/datastore to see your entities.

# We need to identify the entity type for our list items.
# Note that this data type is arbitrary and can be whatever you like


def log(msg):
    """Log a simple message."""
    # Look at: https://console.cloud.google.com/logs to see your logs.
    # Make sure you have "stdout" selected.
    print('slidata: %s' % msg)


def convert_to_userObj(entity):
    """Convert the entity returned by datastore to a normal object."""
    user_id = entity.key.id_or_name
    return User(user_id, entity['email'], entity['name'])


def load_user_key(client, user_id):
    """Load a datastore key using a particular client, and if known, the ID.
    Note the ID should be an int - we're allowing datastore to generate them in
    this example."""
    key = None
    key = client.key(config.USER_ENTITY_TYPE, user_id)
    return key


def load_user_entity(client, user_id):
    """Load a datstore entity using a particular client, and the ID."""
    key = load_user_key(client, user_id)
    entity = client.get(key)
    log('retrieved entity for ' + user_id)
    return entity


def checkUser(user_id):
    # Retrieve the list items we've already stored.
    client = datastore.Client(config.PROJECT_ID)
    # we build a query
    query = client.query(kind=config.USER_ENTITY_TYPE)
    # we execute the query
    users = list(query.fetch())
    # the code below converts the datastore entities to plain old objects
    # then list of ids is created
    ids = list()
    for item in users:
        tempUser = convert_to_userObj(item)
        ids.append(tempUser.userId)
    log(str(len(ids)))
    if user_id in ids:
        log('Found')
        return load_user_key(client, user_id)
    else:
        log('Not found')
        return None


def create_user(user):
    """Create a new shopping list item entity from the specified object."""
    client = datastore.Client(config.PROJECT_ID)
    key = load_user_key(client, user.userId)
    entity = datastore.Entity(key)
    entity['email'] = user.userEmail
    entity['name'] = user.userName
    entity['loyalty points'] = 0
    entity['total money spent'] = 0
    client.put(entity)
    log('saved new entity for ID: %s' % key.id_or_name)


def save_user(user):
    """Save an existing list item from an object."""
    client = datastore.Client(config.PROJECT_ID)
    entity = load_user_entity(client, user.userId)
    entity.update(user.to_dict())
    client.put(entity)
    log('entity saved for ID: %s' % user.id)


def get_user(user_id):
    """Retrieve an object for user obj """
    client = datastore.Client(config.PROJECT_ID)
    log('retrieving object for ID: %s' % user_id)
    entity = load_user_entity(client, user_id)
    return convert_to_userObj(entity)


def delete_user(user_id):
    """Delete the entity associated with the specified ID."""
    client = datastore.Client(config.PROJECT_ID)
    key = load_user_key(client, user_id)
    log('key loaded for ID: %s' % user_id)
    client.delete(key)
    log('key deleted for ID: %s' % user_id)


# where does this go
def save_order():
    datastore_client = datastore.Client()
    kind = 'Order'
    name = 'name this later'
    task_key = datastore_client.key(kind, name)
    task = datastore.Entity(key=task_key)
    task['description'] = 'not sure what I want here'
    datastore_client.put(task)
