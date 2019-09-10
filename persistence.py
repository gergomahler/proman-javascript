import csv

STATUSES_FILE = './data/statuses.csv'
BOARDS_FILE = './data/boards.csv'
CARDS_FILE = './data/cards.csv'

_cache = {}  # We store cached data in this dict to avoid multiple file readings


def _read_csv(file_name):
    """
    Reads content of a .csv file
    :param file_name: relative path to data file
    :return: OrderedDict
    """
    with open(file_name) as boards:
        rows = csv.DictReader(boards, delimiter=',', quotechar='"')
        formatted_data = []
        for row in rows:
            formatted_data.append(dict(row))
        return formatted_data


def generate_id(file_name):
    db = _read_csv(file_name)
    ids = [i['id'] for i in db]
    new_id = int(max(ids)) + 1
    return new_id


def get_card_order(board_id, status_id):
    db = _read_csv(CARDS_FILE)
    order = []
    for _id in db:
        if _id['board_id'] == str(board_id) and _id['status_id'] == str(status_id):
            order.append(_id['order'])
    order = [int(num) for num in order]
    if not order:
        return 0
    new_order = max(order) + 1
    return new_order


def append_boards(data):
    with open(BOARDS_FILE, mode='a') as db:
        writer = csv.DictWriter(db, fieldnames=['id', 'title'], quotechar='"')
        _id = generate_id(BOARDS_FILE)
        dict_to_write = {'id': _id,
                         'title': data}
        writer.writerow(dict_to_write)


def append_cards(board_id, title, status_id):
    with open(CARDS_FILE, mode='a') as db:
        writer = csv.DictWriter(db, fieldnames=['id', 'board_id', 'title', 'status_id', 'order'], quotechar='"')
        _id = generate_id(CARDS_FILE)
        dict_to_write = {'id': _id,
                         'board_id': board_id,
                         'title': title,
                         'status_id': status_id,
                         'order': get_card_order(board_id, status_id)}
        writer.writerow(dict_to_write)


def _get_data(data_type, file, force):
    """
    Reads defined type of data from file or cache
    :param data_type: key where the data is stored in cache
    :param file: relative path to data file
    :param force: if set to True, cache will be ignored
    :return: OrderedDict
    """
    if force or data_type not in _cache:
        _cache[data_type] = _read_csv(file)
    return _cache[data_type]


def clear_cache():
    for k in list(_cache.keys()):
        _cache.pop(k)


def get_statuses(force=False):
    return _get_data('statuses', STATUSES_FILE, force)


def get_boards(force=False):
    return _get_data('boards', BOARDS_FILE, force)


def get_cards(force=False):
    return _get_data('cards', CARDS_FILE, force)