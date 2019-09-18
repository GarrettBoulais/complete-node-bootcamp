const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
    trim: true,
    maxlength: [40, 'A tour name must have at most 40 characters'],
    minlength: [10, 'A tour name must have at least 10 characters'],
    // validate: [validator.isAlpha, 'Name must only contain characters']
  },
  duration: {
    type: Number,
    required: [true, 'A tour must have a duration']
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a group size']
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty'],
    enum: {
      values: ['easy', 'medium', 'difficult'], 
      message: 'Difficulty can be: easy, medium, or difficult'
    }
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'A rating must be above 1.0'],
    max: [5, 'A rating must be below 5.0']
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price']
  },
  priceDiscount: {
    type: Number,
    validate: {
      validator: function(value) { 
        // this only points to current doc on NEW document creation
        return value < this.price;
      },
      message: 'discount price ({VALUE}) must be less than price'
    }
  },
  summary: {
    type: String,
    trim: true,
    required: [true, 'A tour must have a summary']
  },
  description: {
    type: String,
    trim: true
  },
  imageCover: {
    type: String,
    required: [true, 'A tour must have a cover photo']
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false // not included in any queries
  },
  startDates: [Date],
  slug: String,
  secretTour: {
    type: Boolean,
    default: false
  }
},
// Options
{
  toJSON: {virtuals: true}, 
  toObject: {virtuals: true} 
}
);

// note this property is not part of database so we cant query it
tourSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7;
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
// 'save' is a hook. Whole thing is called pre save hook
tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// QUERY MIDDLEWARE
tourSchema.pre(/^find/, function(next) {
  this.find({ secretTour: { $ne: true }});
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function(docs,next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  // console.log(docs);
  next();
});

// AGGREGATION MIDDLEWARE
// hide secret tours from stats
tourSchema.pre('aggregate', function(next) {
  this.pipeline().unshift({ $match: {secretTour: {$ne: true}} });
  console.log(this.pipeline());
  next();
});

// create a tour model from our schema
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour; // export tour model
