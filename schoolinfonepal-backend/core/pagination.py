from rest_framework.pagination import PageNumberPagination

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 12                 # Default page size (change as needed)
    page_size_query_param = 'page_size'  # Allow frontend to override
    max_page_size = 50             # Prevent excessive page size
    page_query_param = 'page'      # The page query param (?page=2)
