from google.cloud import datastore
from Order import Order
import config


def convert_to_userObj(entity):
    """Convert the entity returned by datastore to a normal object."""
    order_id = entity.key.id_or_name
    return Order(order_id, entity['name'],  entity['size'] ,entity['tea'] ,entity['flavor'] ,entity['milk'] ,entity['sweetness'] ,entity['temp'] ,entity['toppings'] ,entity['price'],entity['payment'], entity['time'])


def get_list_items():
    """Retrieve the list items we've already stored."""
    client = datastore.Client(config.PROJECT_ID)

    # we build a query
    query = client.query(kind=config.ORDER_ENTITY_TYPE)
    # query.order = ['time']
    # we execute the query
    order_items = list(query.fetch())
    log(order_items)

    # the code below converts the datastore entities to plain old objects -
    # this is good for decoupling the rest of our app from datastore.
    result = list()
    for order in order_items:
        result.append(convert_to_userObj(order))

    log('list retrieved. %s items' % len(result))
    return result


def log(msg):
    """Log a simple message."""
    # Look at: https://console.cloud.google.com/logs to see your logs.
    # Make sure you have "stdout" selected.
    print('order: %s' % msg)


def load_key(client, item_id=None):
    """Load a datastore key using a particular client, and if known, the ID.  Note
    that the ID should be an int - we're allowing datastore to generate them in 
    this example."""
    key = None
    if item_id:
        key = client.key(config.ORDER_ENTITY_TYPE, int(item_id))
    else:
        # this will generate an ID
        key = client.key(config.ORDER_ENTITY_TYPE)
    return key


def delete_order_item(order_id):
    """Delete the entity associated with the specified ID."""
    client = datastore.Client(config.PROJECT_ID)
    key = load_key(client, order_id)
    log('key loaded for ID: %s' % order_id)
    client.delete(key)
    log('key deleted for ID: %s' % order_id)