var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({

  headline: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  isSaved: {
    type: Boolean,
    default: false
  },
  comments: {
    type: Schema.Types.ObjectId,
    ref: "Comment"
  }
});

ArticleSchema.methods.saved = function() {
  this.isSaved = true;

  return this.isSaved;
};

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;
