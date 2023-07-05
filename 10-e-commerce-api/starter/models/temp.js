[
    {
      '$match': {
        'product': new ObjectId('64a56497cd67a9016bfd473e')
      }
    }, {
      '$group': {
        '_id': null, 
        'averageRating': {
          '$avg': '$rating'
        }, 
        'numberOfReviews': {
          '$sum': 1
        }
      }
    }
  ]