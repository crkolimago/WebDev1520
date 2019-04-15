

# Look at: https://console.cloud.google.com/datastore to see your entities.
from google.cloud import datastore
from Order import Order
import config
import userData
# We need to identify the entity type for our list items.
# Note that this data type is arbitrary and can be whatever you like


def log(msg):
    """Log a simple message."""
    # Look at: https://console.cloud.google.com/logs to see your logs.
    # Make sure you have "stdout" selected.
    print('slidata: %s' % msg)


def convert_to_orderObj(entity):
    """Convert the entity returned by datastore to a normal object."""
    order_id = entity.key.id_or_name
    return Order(order_id, entity['name'], entity['size'], entity['tea'], entity['flavor'], entity['milk'], entity['sweetness'], entity['temp'], entity['toppings'], entity['price'], entity['payment'], entity['time'], entity['url'])


def load_user_order_key(client, order_id, user_id):
    """Load a datastore key using a particular client, and if known, the ID.
    Note the ID should be an int - we're allowing datastore to generate them in
    this example."""
    # userKey = userData.load_user_key(user_id)
    key = None
    log("we in hurr")
    parent_key = client.key(config.USER_ENTITY_TYPE, user_id)
    if order_id:
        key = client.key(config.USER_ORDER_ENTITY_TYPE, int(order_id), parent=parent_key)
    else:
        # this will generate an ID
        log("we really in here")
        key = client.key(config.USER_ORDER_ENTITY_TYPE, parent=parent_key)
    return key


def load_user_order_entity(client, order_id, user_id):
    """Load a datastore entity using a particular client, and the ID."""
    key = load_user_order_key(client, order_id, user_id)
    entity = client.get(key)
    log('retrieved entity for ' + order_id)
    return entity


def get_user_order(order_id, user_id):
    """Retrieve an object for the MenuItem with the specified ID."""
    client = datastore.Client(config.PROJECT_ID)
    log('retrieving object for ID: %s' % order_id)
    entity = load_user_order_entity(client, order_id, user_id)
    return convert_to_orderObj(entity)


def get_user_orders(user_id):
    """Retrieve the list items we've already stored."""
    client = datastore.Client(config.PROJECT_ID)
    ancestor = client.key(config.USER_ENTITY_TYPE, user_id)
    # we build a query
    query = client.query(kind=config.USER_ORDER_ENTITY_TYPE, ancestor=ancestor)

    # we execute the query
    order_items = list(query .fetch())
    # the code below converts the datastore entities to plain old objects -
    # this is good for decoupling the rest of our app from datastore.
    result = list()
    for order_item in order_items:
        result.append(convert_to_orderObj(order_item))

    log('list retrieved. %s items' % len(result))
    return result


def checkorder(order_id, user_id):
    # Retrieve the list items we've already stored.
    client = datastore.Client(config.PROJECT_ID)
    # we build a query
    query = client.query(kind=config.USER_ORDER_ENTITY_TYPE)
    # we execute the query
    orders = list(query.fetch())
    # the code below converts the datastore entities to plain old objects
    # then list of ids is created
    ids = list()
    for item in orders:
        temporder = convert_to_orderObj(item)
        ids.append(temporder.orderId)
    if order_id in ids:
        log('Found')
        return load_user_order_key(client, order_id, user_id)
    else:
        log('Not found')
        return None


def create_order(order, user_id):
    """Create a new shopping list item entity from the specified object."""
    client = datastore.Client(config.PROJECT_ID)
    key = load_user_order_key(client, order.orderId, user_id)
    entity = datastore.Entity(key)
    entity['name'] = order.name
    entity['size'] = order.size
    entity['tea'] = order.tea
    entity['flavor'] = order.flavor
    entity['milk'] = order.milk
    entity['sweetness'] = order.sweetness
    entity['temp'] = order.temp
    entity['toppings'] = order.toppings
    entity['payment'] = order.payment
    entity['price'] = order.price
    entity['time'] = order.time
    entity['url'] = order.url
    client.put(entity)
    log('HEYYYYYY saved new entity for ID: %s' % user_id)


def save_order(order, user_id):
    """Save an existing list item from an object."""
    client = datastore.Client(config.PROJECT_ID)
    entity = load_user_order_entity(client, order.orderId, user_id)
    entity.update(order.to_dict())
    client.put(entity)
    log('entity saved for ID: %s' % order.orderId)


def get_order(order_id, user_id):
    """Retrieve an object for order obj """
    client = datastore.Client(config.PROJECT_ID)
    log('retrieving object for ID: %s' % order_id)
    entity = load_user_order_entity(client, order_id, user_id)
    return convert_to_orderObj(entity)


def get_entity(order_id, user_id):
    """Load a datastore entity using a particular client, and the ID."""
    client = datastore.Client(config.PROJECT_ID)
    log('retrieve object for ID: %s' % order_id)
    entity = load_user_order_entity(client, order_id, user_id)
    return entity


def delete_order(order_id, user_id):
    """Delete the entity associated with the specified ID."""
    client = datastore.Client(config.PROJECT_ID)
    key = load_user_order_key(client, order_id, user_id)
    log('key loaded for ID: %s' % order_id)
    client.delete(key)
    log('key deleted for ID: %s' % order_id)
