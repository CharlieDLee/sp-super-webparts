export interface ISuperSearchParameters {
  p: string;
  k: string;
  f: string;
}
/**
 *
 * Function used to return parameters read from given url,
 *
 * Returns 3 fields:
 *  - the P parameter (used for Page)
 *  - the K parameter (used for Keyword)
 *  - the F parameter (used for Filters)
 *
 */
export function getHashValues(urlHash: string): ISuperSearchParameters {
  let hashValues: Array<{
    key: string;
    value: string;
  }> = [];
  if (urlHash) {
    hashValues = urlHash.substr(1).split('&').map(hash => {
      const values = hash.split('=');
      return {
        key: values[0] || '',
        value: values[1] || ''
      };
    });
  }

  return {
    p: (hashValues.filter(hash => hash.key === 'p')[0] || { value: '' }).value,
    k: (hashValues.filter(hash => hash.key === 'k')[0] || { value: '' }).value,
    f: (hashValues.filter(hash => hash.key === 'f')[0] || { value: '{}' }).value
  };
}
