# thenia

# rpg engine as a service

thenia models an abstract two-dimensional world, and incidentally
can store other state as needed

the idea behind pulling out its world-definitions here is to ensure that
we've got a clean separation of concerns

for instance:

- [ ] nomos should define its own desert cartogram, distinct from thenia's engine
- [ ] thenia is an 'abstract' rpg engine that shouldn't care where it lives
      (both excalibur and nomos are details that should be abstracted over if we can?)

i wonder if some of this is overengineering/architecture astronaut stuff...
just build the game, we'll see what we need as we go

but already starting to feel like the engine itself could be extracted
and better tested

in isolation we could test some kind of eventing system, which seems like what
we need now anyway...

----------------------------------------------------------------

there would be a lot of value in having a formal model of the entire system
that we then plug details like excalibur into

it doesn't necessarily mean stop forward progress, but consider extracting
things into controllers and consider starting to enforce some upstream/downstream
boundaries?

think about the injection flow anyway, should meditate on how that should work