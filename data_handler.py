import persistence


def get_card_status(status_id):
    """
    Find the first status matching the given id
    :param status_id:
    :return: str
    """
    statuses = persistence.get_statuses()
    return next((status['title'] for status in statuses if status['id'] == str(status_id)), 'Unknown')


def get_boards():
    """
    Gather all boards
    :return:
    """
    return persistence.get_boards(force=True)


def get_cards_for_board(board_id):
    persistence.clear_cache()
    all_cards = persistence.get_cards()
    matching_cards = []
    for card in all_cards:
        if card['board_id'] == str(board_id):
            card['status_id'] = get_card_status(card['status_id'])  # Set textual status for the card
            matching_cards.append(card)
    return matching_cards


def create_table(data):
    persistence.append_boards(data)


def create_card(board_id, title, status_id):
    persistence.append_cards(board_id, title, status_id)


def delete_card(card_id):
    persistence.delete_card(card_id)


def delete_board(board_id):
    persistence.delete_cards_by_board_id(board_id)
    persistence.delete_board_by_board_id(board_id)


def update_board_title(board_id, new_title):
    persistence.update_board_title(board_id, new_title)
